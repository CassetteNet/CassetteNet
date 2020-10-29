import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import PageFrame from './components/PageFrame';
import StartPage from './components/pages/StartPage';
import DashboardPage from './components/pages/DashboardPage';
import LoginPage from './components/pages/LoginPage';
import MyMixtapesPage from './components/pages/MyMixtapesPage';
import FavoritedMixtapesPage from './components/pages/FavoritedMixtapesPage';
import AtmospherePage from './components/pages/AtmospherePage';
import InboxPage from './components/pages/InboxPage';
import SignUpPage from './components/pages/SignUpPage';
import NotFoundPage from './components/pages/NotFoundPage';
import ViewMixtapePage from './components/pages/ViewMixtapePage';
import ViewUserPage from './components/pages/ViewUserPage';
import UserContext from './contexts/UserContext';
import CurrentSongContext from './contexts/CurrentSongContext';
import PlayingSongContext from './contexts/PlayingSongContext';
import Directory from './components/Directory';
import ListeningRoomPage from './components/pages/ListeningRoomPage';
import ViewAccountPage from './components/pages/ViewAccountPage';
import ChangePasswordPage from './components/pages/ChangePasswordPage';
import FollowedUsersPage from './components/pages/FollowedUsersPage';

import ViewAdminPage from './components/pages/ViewAdminPage';
import AdminPage from './components/pages/AdminPage';
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


  // check if song is playing
  let currentSongDefault = JSON.parse(localStorage.getItem('currentSong'));
  if (!currentSongDefault) {
    currentSongDefault = null;
  }
  const [currentSong, setCurrentSong] = useState(currentSongDefault);
  useEffect(() => {
    localStorage.setItem('currentSong', JSON.stringify(currentSong));
  }, [JSON.stringify(currentSong)]);


  const [playing, setPlaying] = useState(false);

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <CurrentSongContext.Provider value={{currentSong, setCurrentSong}}>
          <PlayingSongContext.Provider value={{playing, setPlaying}}>
            <BrowserRouter>
                <PageFrame invisible={!user.isLoggedIn} />
                  <div style={{ position: 'absolute', left: 8*9, height: 'calc(100vh - 8*9)', width: 'calc(100vw - 73px)'}}>
                    <Switch>
                      <Route exact path="/" component={Directory} />
                      <Route exact path="/start" component={StartPage} /> {/* TODO: should redirect to dashboard when logged in */}
                      <Route exact path="/login" component={LoginPage} />
                      <Route exact path="/dashboard" component={DashboardPage} />
                      <Route exact path="/atmosphere" component={AtmospherePage} />
                      <Route exact path="/mixtape/:id" component={ViewMixtapePage} />
                      <Route exact path="/mymixtapes" component={MyMixtapesPage} />
                      <Route exact path="/favoritedmixtapes" component={FavoritedMixtapesPage} />
                      <Route exact path="/viewuser" component={ViewUserPage} />
                      <Route exact path="/followedusers" component={FollowedUsersPage}/>
                      <Route exact path="/inbox" component={InboxPage} />
                      <Route exact path="/NotFound" component={NotFoundPage}/>
                      <Route exact path="/SignUp" component={SignUpPage}/>
                      <Route exact path="/ChangePassword" component={ChangePasswordPage}/>
                      <Route exact path="/Admin" component={AdminPage}/>
                      <Route exact path="/ViewAccount" component={ViewAccountPage}/>
                      <Route exact path="/ViewAdminPage" component={ViewAdminPage}/>
                      <Route exact path="/listeningroom" component={ListeningRoomPage} /> {/* temporary route for listening room testing */}
                    </Switch>
                  </div>
            </BrowserRouter>
          </PlayingSongContext.Provider>
        </CurrentSongContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
