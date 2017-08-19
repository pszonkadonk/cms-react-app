import React, { Component } from 'react';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';

import NavigationBar from '../navigation/NavigationBar.js';
import AdminPanel from '../admin/AdminPanel.js'

import SignupForm from './SignupForm.js'

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            errors: {},
            token: "",
            loggedIn: false
        };
        this.handleUsernameChange= this.handleUsernameChange.bind(this);
        this.handlePasswordChange= this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({
            username: event.target.value
        });
    }
    handlePasswordChange(event) {
        this.setState({
            password: event.target.value
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        if(this.state.username === '' || this.state.password === '') {            
            alert("You must provide a valid username and password");
            return;
        }

        const loginPayLoad = {
            username: this.state.username,
            password: this.state.password
        }
        
    

        axios.post("/login", loginPayLoad).then(response => {
            if(response.data.returnObject) {
                const token = response.data.returnObject.token;
                const username = response.data.returnObject.username;
                const administrator = response.data.returnObject.administrator;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('user', username);
                localStorage.setItem('administrator', administrator);
                setAuthorizationToken(token);
                this.setState({
                    loggedIn: true
                });
            }
            else {
                alert("Your username or password is invalid");
            }            
        });
    }


    render() {
        const { loggedIn } = this.state;
        if(loggedIn) {
            console.log("redirecting to admin panel");
            return <Redirect to="/admin" />
        }

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                    <h1>Login</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" value={this.state.username} onChange={this.handleUsernameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button> 
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};

export default LoginForm