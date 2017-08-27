import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import setAuthorizationToken from "./utils/setAuthorizationToken.js"
import 'bootstrap/dist/css/bootstrap.css';
import socketConnection from './utils/socketConnection.js';



// import "bootstrap/dist/css/bootstrap-theme.css"


// setAuthorizationToken(localStorage.jwtToken);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
