import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import StructureList from './StructureList';
import EditStructurePage from './EditStructurePage';
import AddStructurePage from './AddStructurePage';

// structure components

import TextBox from './structure_components/TextBox.js'
import NumberTextBox from './structure_components/NumberTextBox.js'
import CheckBox from './structure_components/CheckBox.js'
import TextArea from './structure_components/TextArea.js'
import ImageUpload from './structure_components/ImageUpload.js'
import PageReference from './structure_components/TextBox.js'
import WysiwygEditor from './structure_components/WysiwygEditor.js'
import DatePicker from './structure_components/DatePicker.js'
import YoutubeEmbed from './structure_components/YoutubeEmbed.js'
import EntryReference from './structure_components/EntryReference.js'
import FileUpload from './structure_components/FileUpload.js'



class Structure extends Component{
    constructor(props) {
        super(props);
        this.state = {
            components: this.props.components
        }
        this.chooseComponent = this.chooseComponent.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            components: nextProps.components
        });
    }

    chooseComponent(structureComponent) {
        if(structureComponent.component === "text-input-string") {
            return (
                <div>
                    <TextBox data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>
                </div>
            )
        }
        else if(structureComponent.component === "text-input-number") {
            return (
                <div>
                    <NumberTextBox data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>
                </div>
            )
        }
        else if(structureComponent.component === "checkbox") {
            return (
                <div>
                    <CheckBox data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>
                </div>
            )
        }
        else if(structureComponent.component === "textarea") {
            return(
                <div>
                    <TextArea data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>
                </div>
            ) 
        }
        else if(structureComponent.component === "image-upload") {
            return (
                <div>
                    <ImageUpload data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                
                </div>
            )
        }
        else if(structureComponent.component === "link") {
            return (
                <div>
                    <PageReference data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                
                </div>
            )
        }
        else if(structureComponent.component === "wysiwyg-editor") {
            return (
                <div>
                    <WysiwygEditor data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                
                </div>
            )
        }
        else if(structureComponent.component === "datepicker") {
            return (
                <div>
                    <DatePicker data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                                
                </div>
            )   
        }
        else if(structureComponent.component === "youtube") {
            return (
                <div>
                    <YoutubeEmbed data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                                
                </div>
            ) 
        }
        else if(structureComponent.component === "reference-entry") {
            return (
                <div>
                    <EntryReference data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                                
                </div>
            ) 
        }
        else if(structureComponent.component === "upload-file") {
            return (
                <div>
                    <FileUpload data={structureComponent} />
                    <button className="btn btn-danger" value={structureComponent.label} onClick={this.props.removeField}>Remove</button>                                
                </div>
            )
        }
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