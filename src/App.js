import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ReactRouter, BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';


import NavigationBar from './NavigationBar.js';
import SignupForm from './forms/SignupForm.js'
import LoginForm from './forms/LoginForm.js'



class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div className="container">
            <NavigationBar />
            <Route path="/signup" component={SignupForm} />
            <Route path="/login" component={LoginForm} />
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
