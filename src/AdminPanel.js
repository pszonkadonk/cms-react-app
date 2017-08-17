import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

import StructureList from './StructureList.js';
import Structure from './Structure.js';
import AdminRoutes from './AdminRoutes.js'


const AdminPanel = () => {
    return (
    <div className="container">
        <AdminRoutes />
    </div>
    );            
}

export default AdminPanel;