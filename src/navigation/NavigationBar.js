import React, { Component } from 'react';
import { ReactRouter, BrowserRouter, Route, Link, NavLink } from 'react-router-dom';


import SignupForm from '../forms/SignupForm.js'
import LoginForm from '../forms/LoginForm.js'

import StructureListNonAdmin from '../structures/StructureListNonAdmin';


class NavigationBar extends Component {
    constructor(props) {
        super(props)
        let loggedin = false;
        if(localStorage.length === 0) {
            loggedin = false;
        } else {
            loggedin = true;
        }

        this.state = {
            loggedin: loggedin
        };


        this.logout = this.logout.bind(this);
    }

    logout() {
        localStorage.clear();
        this.setState({
            loggedin: false
        })
    }

        render() {
            return( 

                <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <NavLink exact className="navbar-brand" to="/">CMS-App</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active nav-link">
                            <NavLink activeClassName="active" to="/">Home</NavLink>
                        </li>
                        <li className="nav-item active nav-link">
                            <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
                        </li>
                        {this.state.loggedin ? (
                            <li className="nav-item active nav-link">
                                <NavLink activeClassName="active" to="/" onClick={this.logout}>Log Out</NavLink>
                            </li>   
                        ): (
                            <li className="nav-item active nav-link">
                                <NavLink activeClassName="active" to="/login">Log In</NavLink>
                            </li>
                        )
                        }
                        <li className="nav-item active nav-link">
                            <NavLink activeClassName="active" to="/structures">Structure List</NavLink>
                        </li>
                        <li className="nav-item active nav-link">
                            <NavLink activeClassName="active" to="/users?page=1">User List</NavLink>
                        </li>

                        {localStorage.administrator === "true" ? (
                            <li className="nav-item active nav-link">
                                <NavLink activeClassName="active" to="/admin">Admin Panel</NavLink>
                            </li>   
                        ): (
                            <li></li>
                        )
                        }            
                    </ul>
                </div>
              </nav>


            )
        }
    }

export default NavigationBar

{/* <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
<button type="button" className="navbar-toggler navbar-toggler-right" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
    <span className="navbar-toggler-icon"></span>
</button>
<NavLink exact className="navbar-brand" to="/">CMS-App</NavLink>
<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
<ul className="navbar-nav mr-auto">
    <li className="nav-item active">
        <NavLink activeClassName="active" to="/">Home</NavLink>
    </li>
    <li className="nav-item">
        <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
    </li>
    {this.state.loggedin ? (
    <li className="nav-item">
        <NavLink activeClassName="active" to="/" onClick={this.logout}>Log Out</NavLink>
    </li>   
    ): (
        <li className="nav-item active">
            <NavLink activeClassName="active" to="/login">Log In</NavLink>
        </li>
    )
    }
    {localStorage.administrator === "true" ? (
    <li className="nav-item active">
        <NavLink activeClassName="active" to="/admin">Admin Panel</NavLink>
    </li>   
    ): (
        <li></li>
    )
    }
</ul>
</div>  
</nav>  */}