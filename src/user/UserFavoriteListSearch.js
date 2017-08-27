import React, { Component } from 'react';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";
const io = require('socket.io-client')
const socket = io('http://localhost:3001');
const queryString = require('query-string');



class UserFavoriteListSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            structureSlug: "",
            page: "",
            users: []
        };
    }

    componentWillMount() {
        let parsedUrlQuery = queryString.parse(this.props.location.search);
        this.setState({
            page: parsedUrlQuery.page,
            structureSlug: this.props.match.params.structure
        });
        
        let jwtToken = localStorage.jwtToken;
        socket.emit('loggedIn', {
            token: jwtToken                    
        }); 

        socket.emit('userFavoriteList');
        
        socket.on('userFavoriteList', (users) => {
            console.log("USERS");
            console.log(users);

            axios.get(`/retrieve-favorites/${this.state.structureSlug}`).then((response) => {
                console.log("response");
                console.log(response);

                if(response.data.error) {
                    alert(response.data.error);
                    return;
                }

                let activeUserFavorites = []
                response.data.filter((element) => {
                    for(let i = 0; i < users.activeUsers.length; i++) {
                        if(users.activeUsers[i].username === element.username) {
                            activeUserFavorites.push(element)
                            break;
                        }
                    }
                    console.log(activeUserFavorites);
                    return activeUserFavorites;
                });
                
                console.log(activeUserFavorites);

                this.setState({
                    users: activeUserFavorites
                });
            });
        }); 

    }

    render() {
        return(
        <div>
            <h3>Search User Favorite List</h3>
            <h2>Favorites for {this.state.structureSlug}</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>User</th>
                    <th>Entry</th> 
                </tr>
                </thead>
                {this.state.users.map(element =>
                <tbody>
                    {element.filteredFavs.map(fav =>
                        <tr>
                            <td>{element.username}</td>
                            <td>{fav.entrySlug}</td>              
                        </tr>
                        )}
                </tbody>          
                    )}  
            </table>
            </div> 
        )
    }
}


export default UserFavoriteListSearch;



