import React, { Component } from 'react';
import axios from 'axios';

class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        };
        this.fetchUsers = this.fetchUsers.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    fetchUsers() {
        axios.get("/user-list").then((response) => {
            if(response.data !== "undefined") {
                console.log(response.data)
                this.setState({
                    users: response.data
                })
            }
        });
    }

    componentDidMount() {
        this.fetchUsers();
    }

    handleClick(event) {
        console.log("Entered handle click");
        axios.put("/make-administrator", {user: event.target.value}).then(response => {
            this.fetchUsers();
        });
    }
    
    render() {
        return(
            <div>
            <h1>User Count: {this.state.users.length}</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Administrator</th> 
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.users.map(element =>
                        <tr>
                            <td>{element.username}</td>
                            {element.administrator === "false" || element.administrator === false ? (
                                <td>Not Admin</td>
                            ) : (
                                <td>Admin</td>
                            )}
                            {element.administrator === "false" || element.administrator === false ? (
                                <td><button value={element.username} className="btn btn-success" onClick={this.handleClick}>Make Admin</button></td>
                            ) : (
                                <td></td>
                            )}
                        </tr>
                    )}  
                </tbody>          
            </table>
            </div>
        )
    }
}


export default UserList;