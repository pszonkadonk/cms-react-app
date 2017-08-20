import React, { Component } from 'react';
import { ReactRouter, BrowserRouter as Router, Route, Link, NavLink, Switch } from 'react-router-dom';
import StructureList from '../structures/StructureList.js';
import Structure from '../structures/Structure.js';
import EditStructurePage from '../structures/EditStructurePage';
import AddStructurePage from '../structures/AddStructurePage';
import UserList from '../user/UserList';



const AdminRoutes = () => {
    return(
        <Router>
            <div>
                <ul className="admin-panel-routes">
                    <li><Link to='/admin/structures'>Structure List</Link></li>
                    <li><Link to='/admin/structures/new'>Add Structure</Link></li>
                    <li><Link to='/admin/users'>User List</Link></li>
                </ul>
                <Switch>
                    <Route exact path='/admin/structures/new' component={AddStructurePage}/>
                    <Route exact path='/admin/structures/:slug' component={EditStructurePage}/>
                    <Route path='/admin/structures' component={StructureList}/>
                    <Route exact path='/admin/users' component={UserList}/>

                </Switch>
            </div>
        </Router>
    )
}

export default AdminRoutes;