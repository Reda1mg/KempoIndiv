require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { sendEmail } = require('./src/utils/emailHandler.cjs');
const crypto = require('crypto');

const app = express();

app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kempo_db',
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware: Authenticate & Authorize Token
const authenticateToken = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      if (roles.length && !roles.includes(user.role)) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
};


// Register
app.post('/register', async (req, res) => {
  const { username, password, role, email } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required (username, password, role)' });
  }

  try {
    // Check if username is taken
    db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      if (results.length > 0) return res.status(409).json({ message: 'Username already taken' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertQuery = `
        INSERT INTO user (username, password, role, email)
        VALUES (?, ?, ?, ?)
      `;

      const values = [username, hashedPassword, role, email || null];

      db.query(insertQuery, values, (err) => {
        if (err) {
          console.error("❌ Error inserting user:", err);
          return res.status(500).json({ message: 'Error registering user' });
        }

        res.status(201).json({ message: '✅ User registered successfully' });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM user WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).send('Invalid credentials');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid credentials');

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});

// Create tournament
app.post('/tournament/create', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const { name, city, club, start_date, end_date } = req.body;
  const user_id = req.user.id;
  const id = uuidv4();

  if (!name || !city || !club || !start_date || !end_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const formattedStart = `${start_date} 00:00:00`;
  const formattedEnd = `${end_date} 00:00:00`;

  const query = `INSERT INTO tournament (id, name, city, club, start_date, end_date, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [id, name, city, club, formattedStart, formattedEnd, user_id], (err) => {
    if (err) {
      console.error('Error creating tournament:', err);
      return res.status(500).json({ message: 'Failed to create tournament' });
    }

    res.status(201).json({ message: 'Tournament created successfully', id });
  });
});

// Edit tournament
app.put('/tournament/edit/:id', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const { name, city, club, start_date, end_date } = req.body;
  const { id } = req.params;
  const user_id = req.user.id;

  if (!name || !city || !club || !start_date || !end_date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const formattedStart = `${start_date} 00:00:00`;
  const formattedEnd = `${end_date} 00:00:00`;

  const query = `UPDATE tournament 
    SET name = ?, city = ?, club = ?, start_date = ?, end_date = ?
    WHERE id = ? AND user_id = ?`;

  db.query(query, [name, city, club, formattedStart, formattedEnd, id, user_id], (err, result) => {
    if (err) {
      console.error('Error updating tournament:', err);
      return res.status(500).json({ message: 'Failed to update tournament' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tournament not found or not authorized' });
    }

    res.status(200).json({ message: 'Tournament updated successfully' });
  });
});

// Delete tournament
app.delete('/tournament/delete/:id', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const tournamentId = req.params.id;
  const userId = req.user.id;

  db.query('SELECT * FROM tournament WHERE id = ? AND user_id = ?', [tournamentId, userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Tournament not found or unauthorized' });
    }

    db.query('DELETE FROM tournament WHERE id = ?', [tournamentId], (err) => {
      if (err) return res.status(500).json({ message: 'Delete failed' });
      res.status(202).json({ message: 'Tournament deleted' });
    });
  });
});

// Create competitor
app.post('/competitors', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const { firstname, lastname, birthday, club = '', country = 'France', weight, rank, gender } = req.body;
  const user_id = req.user.id;

  if (!firstname || !lastname || !birthday || !weight || !rank || !gender) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const id = uuidv4();

  const sql = `
    INSERT INTO competitor (
      id, firstname, lastname, birthday, club, country, weight, \`rank\`, gender, user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [id, firstname, lastname, birthday, club, country, weight, rank, gender, user_id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ Error inserting competitor:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    res.status(201).json({ message: "✅ Competitor added successfully", id });
  });
});


// Get competitors by user_id
app.get('/competitors/user', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const user_id = req.user.id;

  db.query('SELECT * FROM competitor WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching competitors:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

// Get competitors by category
app.post('/competitors/category', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const user_id = req.user.id;
  const { categoryId } = req.body;

  const sql = `SELECT * FROM competitor WHERE user_id = ?`; // you may want to add category_id filter here
  db.query(sql, [user_id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching competitors by user and category:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

// Add competitor to tournament
app.post('/tournaments/add-competitor', authenticateToken(['ADMIN', 'UTILISATEUR', 'GESTIONNAIRE']), (req, res) => {
  const { tournamentId, competitorId, categoryId } = req.body;

  const sql = `INSERT INTO tournament_competitor_category (tournament_id, competitor_id, category_id)
    VALUES (?, ?, ?)`;

  db.query(sql, [tournamentId, competitorId, categoryId], (err) => {
    if (err) {
      console.error('❌ Error adding competitor to tournament:', err);
      return res.status(500).json({ message: 'Database error during tournament association' });
    }

    res.status(201).json({ message: 'Competitor added to tournament successfully' });
  });
});

// Password reset
app.post('/forgot_Password', (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000);

  db.query('SELECT * FROM user WHERE email = ?', [email], (err, users) => {
    if (err || users.length === 0) return res.status(400).send("User not found.");

    db.query(
      'UPDATE user SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email],
      async (err) => {
        if (err) return res.status(500).send("Error saving token.");

        const resetLink = `http://localhost:3002/reset-password?token=${token}`;

        try {
          await sendEmail(
            email,
            'Password Reset',
            `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
          );
          res.send("Reset link sent.");
        } catch (e) {
          res.status(500).send("Failed to send email.");
        }
      }
    );
  });
});





// Get tournaments by user 
app.post('/tournaments', (req, res) => {
  const { user_id } = req.body;

  db.query('SELECT * FROM tournament WHERE user_id = ?', [user_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }
    res.send(results);
  });
});
// Get all users (admin-only)
app.get('/users', authenticateToken(['ADMIN']), (req, res) => {
  db.query('SELECT id, username, role, email FROM user', (err, results) => {
    if (err) {
      console.error("❌ Error fetching users:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.status(200).json(results);
  });
});
// Delete user by ID
app.delete('/users/:id', authenticateToken(['ADMIN']), (req, res) => {
  const userId = req.params.id;

  // 1. Delete related matches
const deleteMatches = `
  DELETE FROM \`match\` 
  WHERE competitor1_id IN (
    SELECT id FROM competitor WHERE user_id = ?
  ) OR competitor2_id IN (
    SELECT id FROM competitor WHERE user_id = ?
  )
`;



  db.query(deleteMatches, [userId, userId], (err) => {
    if (err) {
      console.error("Error deleting matches:", err.sqlMessage || err);
      return res.status(500).json({ message: 'Error deleting matches' });
    }

    // 2. Delete tournament_competitor_category links
    const deleteTCC = `
      DELETE tcc FROM tournament_competitor_category tcc
      LEFT JOIN tournament t ON tcc.tournament_id = t.id
      LEFT JOIN competitor c ON tcc.competitor_id = c.id
      WHERE t.user_id = ? OR c.user_id = ?
    `;

    db.query(deleteTCC, [userId, userId], (err) => {
      if (err) {
        console.error("Error deleting tournament_competitor_category:", err.sqlMessage || err);
        return res.status(500).json({ message: 'Error deleting tournament_competitor_category' });
      }

      // 3. Delete competitors
      db.query('DELETE FROM competitor WHERE user_id = ?', [userId], (err) => {
        if (err) {
          console.error("Error deleting competitors:", err.sqlMessage || err);
          return res.status(500).json({ message: 'Error deleting competitors' });
        }

        // 4. Delete tournaments
        db.query('DELETE FROM tournament WHERE user_id = ?', [userId], (err) => {
          if (err) {
            console.error("Error deleting tournaments:", err.sqlMessage || err);
            return res.status(500).json({ message: 'Error deleting tournaments' });
          }

          // 5. Finally, delete the user
          db.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            if (err) {
              console.error("Error deleting user:", err.sqlMessage || err);
              return res.status(500).json({ message: 'Error deleting user' });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'User and related data deleted' });
          });
        });
      });
    });
  });
});


// Update user role
app.put('/users/:id/role', authenticateToken(['ADMIN']), (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) return res.status(400).json({ message: 'Role is required' });

  db.query('UPDATE user SET role = ? WHERE id = ?', [role, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User role updated' });
  });
});

// Admin-only route
app.get('/admin', authenticateToken(['ADMIN']), (req, res) => {
  res.send('Welcome, ADMIN user!');
});

// General user route
app.get('/user', authenticateToken(['ADMIN', 'UTILISATEUR', 'VISITEUR', 'GESTIONNAIRE']), (req, res) => {
  res.send(`Hello ${req.user.role}, you have access to user area`);
});

// Visitor-only route
app.get('/visitor', authenticateToken(['VISITEUR']), (req, res) => {
  res.send('Hello, VISITEUR! You have limited access.');
});

// Start server
app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
