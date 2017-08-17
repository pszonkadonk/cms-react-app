import React, { Component } from 'react';
import { ReactRouter, BrowserRouter as Router, Route, Link, NavLink, Switch } from 'react-router-dom';
import StructureList from '../structures/StructureList.js';
import Structure from '../structures/Structure.js';
import EditStructurePage from '../structures/EditStructurePage';
import AddStructurePage from '../structures/AddStructurePage';


const AdminRoutes = () => {
    return(
        <Router>
            <div>
                <Switch>
                    <Route path='/admin/structures' component={StructureList}/>
                    <Route path='/admin/structures/:slug' component={EditStructurePage}/>
                    <Route path='/admin/structures/new' component={AddStructurePage}/>

                </Switch>
                <ul>
                    <li><Link to='/admin/structures'>Structure</Link></li>
                    <li><Link to='/admin/structures/:slug'>Edit Structure</Link></li>
                    <li><Link to='/admin/structures/new'>Add Structure</Link></li>
                </ul>
            </div>
        </Router>
    )
}

export default AdminRoutes;