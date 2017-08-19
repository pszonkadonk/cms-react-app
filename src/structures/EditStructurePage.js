import React, { Component } from 'react';

class EditStructurePage extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <h1>Edit Structure</h1>
                        <button className="btn btn-primary">Add Structure</button>
                    </div>
                </div>
            </div> 
        );
    }
} 

export default EditStructurePage;