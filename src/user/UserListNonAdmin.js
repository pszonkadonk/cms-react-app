import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

class UserListNonAdmin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            page: this.props.history.location.search.split('=')[1]
        };

        console.log(this.state.page);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.sortFavorites = this.sortFavorites.bind(this);
    }

    fetchUsers() {
        axios.get(`/public/user-list?page=${this.state.page}`).then((response) => {
            console.log(response)
            let userList = response.data            
            console.log(userList);
            if(userList !== "undefined") {
                console.log(userList);                
                this.setState({
                        users: userList
                    });
                }
            });
        }

    sortFavorites(a,b) {
        if (a.structureSlug < b.structureSlug)
          return -1;
        if (a.structureSlug > b.structureSlug)
          return 1;
        return 0;
      }
      

    componentDidMount() {
        this.fetchUsers();
    }
    
    render() {
        return(
            <div>
                {this.state.users.map(element =>
                    <div key={element.key} className="user-listing">
                        <h5 key={element.key}>User: {element.username}</h5>
                        <h5 key={element.key}>Sign Up Date: {element.signupDate}</h5>
                        <h5 key={element.key}>Biography: {element.biography}</h5>
                        <h2>Favorite Entries</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Structure Name</th>
                                    <th>Entry Slug</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {element.favorites.sort(this.sortFavorites).map(element =>
                                    <tr key={element.key}>
                                        <td key={element.key}>{element.structureSlug}</td>
                                        <td key={element.key}>{element.entrySlug}</td>
                                </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    )}  
            </div>
        )
    }
}


export default UserListNonAdmin;