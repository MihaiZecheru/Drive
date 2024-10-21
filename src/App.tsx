import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authenticator from './components/base/Authenticator';
import LoginRegister from './components/base/LoginRegister';
import Landing from './components/base/Landing';
import Logout from './components/base/Logout';
import { ModalProvider } from './components/base/useInfoModal';
import ViewFilePage from './components/ViewFilePage';
import ShareFile from './components/ShareFile';
import ViewFolderPage from './components/ViewFolderPage';

function App() {
  return (
    <ModalProvider>
      <Router>
        <Routes>
          { /* Unrestricted access */ }
          <Route path="/" element={ <Authenticator component={ <Landing /> } /> } />
          <Route path="/login" element={ <LoginRegister /> } />
          <Route path="/logout" element={ <Logout /> } />
          <Route path="/share/:id" element={ <ShareFile /> } />

          { /* Restricted access - authentication required */ }
          { /* The home page will route to the ViewFolderPage component and show the __ROOT__ folder */ }
          <Route path="/home" element={ <Authenticator component={ <ViewFolderPage /> } /> } />
          <Route path="/file/:id" element={ <Authenticator component={ <ViewFilePage /> } /> } />
          <Route path="/folder/:id" element={ <Authenticator component={ <ViewFolderPage /> } /> } />
        </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;
