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

  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/login" component={Login} />
        <Route path="/home" render={() => {
          let loggedIn = AppStore.isUserLoggedIn();
          return (
            loggedIn ? (<Home />) : (<Redirect to="/login" />)
          )
        }} />
        <Route exact path="/" render={() => {
          let loggedIn = AppStore.isUserLoggedIn()
          return (
            loggedIn ? (<Redirect to="/home" />) : (<Redirect to="/login" />)
          )
        }
        } />
      </div >
    </BrowserRouter>
  )
}

export default HRMSUIApp