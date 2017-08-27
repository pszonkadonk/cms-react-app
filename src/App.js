import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { ReactRouter, BrowserRouter as Router, Route, Link, NavLink, Redirect, Switch } from 'react-router-dom';


import NavigationBar from './navigation/NavigationBar.js';
import SignupForm from './forms/SignupForm.js';
import LoginForm from './forms/LoginForm.js';

import AdminPanel from './admin/AdminPanel.js';
import AuthorizationErrorPage from './error/AuthorizationErrorPage.js';

import StructureListNonAdmin from './structures/StructureListNonAdmin';
import StructureEntriesNonAdmin from './structures/StructureEntriesNonAdmin';
import StructureEntriesListNonAdminSearch from './structures/StructureEntriesListNonAdminSearch';
import EntryViewContainer from './entries/EntryViewContainer';

import UserListNonAdmin from'./user/UserListNonAdmin.js';
import UserFavoriteList from'./user/UserFavoriteList.js';
import UserFavoriteListSearch from'./user/UserFavoriteListSearch.js';





import Home from './home/Home.js';

import styles from "./styles.css"

const io = require('socket.io-client')
const socket = io('http://localhost:3001');

class App extends Component {

      constructor(props) {
        super(props);        
    }

    componentDidMount() {
   
      }
    

  render() {
    return (
      <div className="App">
        <Router>
          <div className="container">
            <NavigationBar />
            <Route exact path="/" component={Home} />
            <Route path="/admin" render={() => (
              localStorage.administrator==="true"?
                <AdminPanel />
                 :
                <AuthorizationErrorPage />
            )}> 
            </Route> 
              <Route path="/signup" component={SignupForm} />
              <Route path="/login" render={(props) => (<LoginForm {...props} />)} />
              <Route exact path="/structures/" component={StructureListNonAdmin} />
              <Route exact path="/structures/:structureSlug/favorites" component={UserFavoriteList} />
              <Route path="/:structure/favorites" component={UserFavoriteListSearch} />       
              <Route path="/users" component={UserListNonAdmin} />
              <Route exact path="/structures/:structureSlug/list" component={StructureEntriesNonAdmin} />
              <Route path="/structures/:structureSlug/list/:entrySlug" component={EntryViewContainer} />
              <Route path="/:structure/list" component={StructureEntriesListNonAdminSearch} />        
          </div> 
        </Router>
      </div>
    );
  }
}

export default App;
