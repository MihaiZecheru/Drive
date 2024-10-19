import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authenticator from './components/base/Authenticator';
import Home from './components/base/Home';
import LoginRegister from './components/base/LoginRegister';
import Landing from './components/base/Landing';
import Logout from './components/base/Logout';

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
