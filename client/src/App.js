import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageFrame from './components/PageFrame';
import StartPage from './components/pages/StartPage';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import MyMixtapesPage from './components/pages/MyMixtapesPage';
import AtmospherePage from './components/pages/AtmospherePage';
import InboxPage from './components/pages/InboxPage';
import SignUpPage from './components/pages/SignUpPage';
import NotFoundPage from './components/pages/NotFoundPage';
import UserContext from './contexts/UserContext';
import ViewMixtapePage from './components/pages/ViewMixtapePage';
import Directory from './components/Directory';


function App() {
  // check if user is logged in
  let userDefault = JSON.parse(localStorage.getItem('user'));
  if (!userDefault) {
    userDefault = {
      isGuest: true,
      isLoggedIn: false,
    };
  }
  const [user, setUser] = useState(userDefault);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [JSON.stringify(user)]);

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
            <PageFrame invisible={!user.isLoggedIn} />
              <div style={{ position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: 'calc(100vw - 73px)'}}>
                <Switch>
                  <Route exact path="/" component={Directory} />
                  <Route exact path="/start" component={StartPage} /> {/* TODO: should redirect to dashboard when logged in */}
                  <Route exact path="/login" component={LoginPage} />
                  <Route exact path="/atmosphere" component={AtmospherePage} />
                  <Route exact path="/mixtape/:id" component={ViewMixtapePage} />
                  <Route exact path="/mymixtapes" component={MyMixtapesPage} />
                  <Route exact path="/inbox" component={InboxPage} />
                  <Route exact path="/NotFound" component={NotFoundPage}/>
                  <Route exact path="/SignUp" component={SignUpPage}/>
                </Switch>
              </div>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
