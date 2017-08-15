import React, { Component } from 'react';

import $ from 'jquery'


class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            errors: {},
            token: ""
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
    

        $.post("/login", loginPayLoad, (response) => {
            const token = response.token;
            localStorage.setItem('jwtToken', token);
            // this.setState({
            //     token: expressResponse
            // });
            // alert(this.state.token);
        });
    }


    render() {
        // const { errors, username, password, token} = this.state;
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