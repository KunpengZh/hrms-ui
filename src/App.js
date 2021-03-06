import React from 'react';
import {
  BrowserRouter,
  Route,
  Redirect
} from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import AppStore from './share/AppStore';
import Print from './components/Print/Print';

const HRMSUIApp = () => {

  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route exact path="/" render={() => {
          let loggedIn = AppStore.isUserLoggedIn()
          return (
            loggedIn ? (<Redirect to="/home" />) : (<Redirect to="/login" />)
          )
        }
        } />
        <Route path="/print" component={Print} />
      </div >
    </BrowserRouter>
  )
}

export default HRMSUIApp