import React, { Component } from 'react';
import StructureTile from './StructureTile';
import axios from 'axios';



class Home extends Component {

    constructor(props) {
        super(props)

        this.state = {
            structureListing: []
        }

        this.getStructureList = this.getStructureList.bind(this);
    } 

    componentWillMount() {
        this.getStructureList()
    }

    getStructureList() {
        
        axios.get('/structure-list').then((response) => {
            if(response === "undefined" || response.data.error)  {
                alert("Could not retrieve list of structures");
                return;
            }
            console.log(response);
            this.setState({
                structureListing: response.data
            });
        });
    }



    render() {
        return(
            <div className="container">
                <h1>Welcome To The CMS App</h1>
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        {this.state.structureListing.map(element =>
                            <StructureTile key={element.key} structure={element}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}




export default Home;