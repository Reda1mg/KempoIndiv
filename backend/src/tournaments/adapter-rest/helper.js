async function getTournamentByUserId(userId) {
    // Replace this with your actual database query to get a tournament by user_id
    // Example using SQL or ORM:
    return await db.query('SELECT * FROM tournaments WHERE user_id = $1', [userId]);
}