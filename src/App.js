import React, { useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import StartPage from './components/pages/StartPage';
import PageFrame from './components/PageFrame';

function App() {
  const [loggedIn, setLoggedIn] = useState(false); // set to true to show top/side bar

  return (
    <div className="App">
      <BrowserRouter>
          <div className="App">
            <PageFrame invisible={!loggedIn} />
            <Switch>
              <Route exact path="/" component={StartPage} />
            </Switch>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;
