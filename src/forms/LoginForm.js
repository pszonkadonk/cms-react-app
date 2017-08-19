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
        
        axios.post("/login", loginPayLoad).then((response) => {
            console.log(response);
            if(response.data !== "undefined") {
                const token = response.data.token;
                const administrator = response.data.administrator;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('administrator', administrator);
                setAuthorizationToken(token);
                if(localStorage.administrator === "true") {
                    console.log("redirecting to admin panel");
                    console.log(this.props);
                    this.props.history.push("/admin");
                }
                else {
                    console.log("Redirecting to slash");
                    this.props.history.push("/");
                }
            }
            else {
                alert("Your username or password is invalid");
            }            
        });
    }


    render() {
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