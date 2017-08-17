import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery'

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            passwordConfirmation: "",
            administrator: false
        }        
        this.handleUsernameChange= this.handleUsernameChange.bind(this);
        this.handlePasswordChange= this.handlePasswordChange.bind(this);
        this.handlePasswordConfirmationChange= this.handlePasswordConfirmationChange.bind(this);
        this.handleAdministrator = this.handleAdministrator.bind(this);
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
    handlePasswordConfirmationChange(event) {
        this.setState({
            passwordConfirmation: event.target.value
        });
    }

    handleAdministrator(event) {
        this.setState({
            administrator: !this.state.administrator //flip administrator on each click
        })
    }

    handleSubmit(event) {
        if(this.state.username === '' || this.state.password === '') {
            alert("You must provide a valid username and password");
            return false;
        }
        else if(this.state.password !== this.state.passwordConfirmation) {
            alert("Your passwords do not match");
            return false;
        }

        const signupPayLoad = {
            username: this.state.username,
            password: this.state.password,
            administrator: this.state.administrator
        }
        
        axios.post("/register", signupPayLoad);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                    <h1>Sign Up</h1>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" value={this.state.username} onChange={this.handleUsernameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={this.handlePasswordChange}  />
                            </div>
                           <div className="form-group">
                                <label htmlFor="passwordConfirmation">Password Confirmation</label>
                                <input type="password" className="form-control" id="passwordConfirmation" placeholder="Password Confirmation" value={this.state.passwordConfirmation} onChange={this.handlePasswordConfirmationChange}  />
                            </div>
                            <div className="form-check">
                                <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" onChange={this.handleAdministrator} />
                                Administrator Rights?
                                </label>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button> 
                        </form>
                    </div>
                </div>
            </div>
        );
    }
};


export default SignupForm