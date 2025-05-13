import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import './App.css';
import NavBar from './components/navbar/Navbar'
import Home from './pages/home/home'
import Competitors from "./pages/Competitors/Competitors";
import TournoiDetails from "./pages/TournoiDetails/ToutnoiDetails"
import Telecommande from "./pages/Telecommande/components/Telecommande";
import Scoreboard from "./pages/Scoreboard/Scoarboard";
import AddCompetitorsToCategory from "./pages/TournoiDetails/Components/addCompetitorsToCategory";
import MatchesTable from "./pages/Matches/Components/MatchesTable";
import Login from './pages/Login/Login';
import Admin from './pages/Admin/Admin';
import AdminUsers from './pages/Admin/Components/AdminUsers';
import Register from "./pages/Login/Register";
import ForgotPassword from './pages/ForgotPass/ForgotPassowrd'
import Landing from './pages/Landing/Landing'
import ResetPassword from "./pages/ResetPassword/ResetPassword";
function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path='/tournaments' element={<div className='content'><Home /></div>}></Route>
          <Route path='/competiteurs' element={<div className='content'><Competitors /></div>}></Route>
          <Route path='/telecommande' element={<div className='content'><Telecommande /></div>}></Route>
          <Route path='/scoreboard' element={<div className='content'><Scoreboard /></div>}></Route>
          <Route path='/tournoiDetails/:id' element={<TournoiDetails />}></Route>
          <Route path="/tournoiDetails/:id/ajouter-competiteurs" element={<AddCompetitorsToCategory />} />
          <Route path="/matches/:categoryId" element={<MatchesTable />} />
          <Route path="/matches/:matchId/scoreboard" element={<Scoreboard />} />
          <Route path="/telecommande/:matchId" element={<Telecommande />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/utilisateurs" element={<AdminUsers />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
