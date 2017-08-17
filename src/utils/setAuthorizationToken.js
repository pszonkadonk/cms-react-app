import axios from 'axios'

export default function setAuthorizationToken(token) {
    console.log("Calling from setauthorization token")
    console.log(token);
    if(token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
        console.log("I've deleted token");
        delete axios.defaults.headers.common["Authorization"];
    }
}

