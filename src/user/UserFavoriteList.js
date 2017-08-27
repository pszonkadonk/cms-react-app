import React, { Component } from 'react';
import axios from 'axios';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";
const io = require('socket.io-client')
const socket = io('http://localhost:3001');



class UserFavoriteList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        };
        // this.fetchFavorites = this.fetchFavorites.bind(this);
    }

    componentDidMount() {
        // this.fetchFavorites();        
        socket.emit('userFavoriteList');
        

        socket.on('userFavoriteList', (users) => {
            console.log("USERS");
            console.log(users);

            axios.get(`/retrieve-favorites/${this.props.match.params.structureSlug}`).then((response) => {
                console.log("response");
                console.log(response.data);

                if(response.data.error) {
                    alert(response.data.error);
                    return;
                }
                
                this.setState({
                    users: response.data
                });
            });
        }); 

    }
    // fetchFavorites() {
    //     axios.get("/user-favorites").then((response) => {
    //         if(response.data !== "undefined") {
    //             console.log(response.data)
    //             this.setState({
    //                 users: response.data
    //             })
    //         }
    //     });
    // }



    render() {
        return(
            <div>
                <h2>Favorites for {this.props.match.params.structureSlug}</h2>
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


export default UserFavoriteList;

// {element.filteredFavs.map(fav =>
//     <tr key={fav.key}>
//     </tr>
//     )}
