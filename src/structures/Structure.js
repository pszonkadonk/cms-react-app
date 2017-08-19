import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import StructureList from './StructureList';
import EditStructurePage from './EditStructurePage';
import AddStructurePage from './AddStructurePage';

import TextBox from './structure_components/TextBox';



class Structure extends Component{
    constructor(props) {
        super(props);
        this.state = {
            components: this.props.components
        }
        this.chooseComponent = this.chooseComponent.bind(this);
    }

    chooseComponent(component) {
        console.log(component);

        return <TextBox data={component} />

        // if(component.label === "text-input-string") {
        //     return <li><strong>{component.label}</strong></li>
        // } else {
        //     return <li><italic>{component.label}</italic></li>            
        // }
    }

    render(){
        return(
            <div>
                {this.state.components.map((element) => (
                    this.chooseComponent(element)
                ))}          
            </div>
        )
    }

 
}


export default Structure;


{/* <div>
<h1>This is a Structure</h1>
{this.state.textBoxes.map(element => {
    <h2>Hello</h2>
})}
</div> */}
