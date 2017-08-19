import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';

import StructureList from '../structures/StructureList.js';
import Structure from '../structures/Structure.js';
import AdminRoutes from '../admin/AdminRoutes.js'


const AdminPanel = () => {
    return (
    <div className="container">
        <div className="admin-panel">
            <h1>Admin Panel</h1>
        </div>
        <AdminRoutes />
    </div>
    );            
}

export default AdminPanel;