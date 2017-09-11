import React from 'react';
import {
  BrowserRouter,
  Route,
  Link,
  Redirect
} from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import AppStore from './share/AppStore';

const HRMSUIApp = () => {
  console.log("hi this is home");
  console.log(AppStore.loggedIn);
  AppStore.loggedIn = true;
  let loggedIn = AppStore.loggedIn;
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/login" component={Login} />
        <Route path="/home" render={() => (
          loggedIn ? (
            <Home />
          ) : (
              <Redirect to="/login" />
            )
        )} />
        <Route exact path="/" render={() => (
          loggedIn ? (
            <Redirect to="/home" />
          ) : (
              <Redirect to="/login" />
            )
        )} />
      </div >
    </BrowserRouter>
  )
}

export default HRMSUIApp