import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageFrame from './components/PageFrame';
import StartPage from './components/pages/StartPage';
import AtmospherePage from './components/pages/AtmospherePage';
import NotFoundPage from './components/pages/NotFoundPage';
import UserContext from './contexts/UserContext';


function App() {
  const [user, setUser] = useState({
    username: null,
    isGuest: false,
    isLoggedIn: false,
  });

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
            <PageFrame invisible={!user.isLoggedIn} />
              <div style={{ position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: 'calc(100vw - 73px)'}}>
                <Switch>
                  <Route exact path="/" component={StartPage} /> {/* TODO: should redirect to dashboard when logged in */}
                  <Route exact path="/atmosphere" component={AtmospherePage} />
                  <Route exact path="/NotFound" component={NotFoundPage}/>
                </Switch>
              </div>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
