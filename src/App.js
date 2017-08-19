import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ReactRouter, BrowserRouter as Router, Route, Link, NavLink, Redirect } from 'react-router-dom';


import NavigationBar from './navigation/NavigationBar.js';
import SignupForm from './forms/SignupForm.js';
import LoginForm from './forms/LoginForm.js';

import AdminPanel from './admin/AdminPanel.js';
import AuthorizationErrorPage from './error/AuthorizationErrorPage.js';

import styles from "./styles.css"

class App extends Component {

      constructor(props) {
        super(props);
    }
    

  render() {
    return (
      <div className="App">
        <Router>
          <div className="container">
            {/* <NavigationBar /> */}
            <Route path="/admin" render={() => (
              localStorage.administrator==="true"?
                <AdminPanel />
                 :
                <AuthorizationErrorPage />
            )}> 
            </Route> 
            <Route path="/signup" component={SignupForm} />
            <Route path="/login" render={(props) => (<LoginForm {...props} />)} />
          </div> 
        </Router>

        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
