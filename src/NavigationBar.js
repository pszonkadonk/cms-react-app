import React, { Component } from 'react';
import { ReactRouter, BrowserRouter, Route, Link, NavLink } from 'react-router-dom';


import SignupForm from './forms/SignupForm.js'
import LoginForm from './forms/LoginForm.js'


// import {Navbar, Nav, NavItem, NavDropdown, MenuItem  } from 'react-bootstrap';

class NavigationBar extends Component {
    render() {
        return( 
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <NavLink exact className="navbar-brand" to="/">CMS-App</NavLink>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                <li>
                                    <NavLink activeClassName="active" to="/signup">Sign Up</NavLink>
                                </li>
                                <li>
                                    <NavLink activeClassName="active" to="/login">Log In</NavLink>
                                </li>
                            </ul>
                        </div>  
                    </div>  
                </nav>

            /*<Navbar>
                <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">CMS-APP</a>
                </Navbar.Brand>
                </Navbar.Header>
                <Nav>
                <NavItem eventKey={1} href="#">Signup</NavItem>
                <NavItem eventKey={2} href="#">Login</NavItem>
                </Nav>
            </Navbar>*/
        )
    }
}

export default NavigationBar