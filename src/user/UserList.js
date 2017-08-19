import React, { Component } from 'react';
import axios from 'axios';

class UserList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        };
    }


    componentDidMount() {
        axios.get("/user-list").then((response) => {
            if(response.data !== "undefined") {
                console.log(response.data)
                this.setState({
                    users: response.data
                })
            }



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
                    <th>Admin Status</th>
                </tr>
                </thead>
                <tbody>
                    {this.state.users.map(element =>
                        <tr>
                            <td>{element.username}</td>
                            <td>{element.administrator}</td>
                            {element.administrator === "false" ? (
                                <td><button className="btn btn-success">Make Admin</button></td>
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