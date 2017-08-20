import React, { Component } from 'react';

import bluebg from '../resources/img/royal-blue-bg.jpg';

class StructureTile extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <div className="card"> 
                <img className="card-img-top" src={bluebg} alt="Card image cap" />
                <div className="card-block">
                    <h4 className="card-title">{this.props.structure.name}</h4>
                    <h6 className="card-title">Entries: </h6>
                    <p className="card-text">{this.props.structure.description}</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>

        )
    }
}





export default StructureTile;