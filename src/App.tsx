import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authenticator from './components/Authenticator';
import Home from './components/Home';
import LoginRegister from './components/LoginRegister';
import Landing from './components/Landing';
import Logout from './components/Logout';

function App() {
  return (
    <Router>
      <Routes>
        { /* Unrestricted access */ }
        <Route path="/" element={ <Authenticator component={ <Landing /> } /> } />
        <Route path="/login" element={ <LoginRegister /> } />
        <Route path="/logout" element={ <Logout /> } />

        { /* Restricted access - authentication required */ }
        <Route path="/home" element={ <Authenticator component={ <Home /> } /> } />
      </Routes>
    </Router>
  );
}

export default App;
