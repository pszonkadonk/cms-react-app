import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

// structure components

import TextBox from './entry_components/TextBox.js'
import NumberTextBox from './entry_components/NumberTextBox.js'
import CheckBox from './entry_components/CheckBox.js'
import TextArea from './entry_components/TextArea.js'
import ImageUpload from './entry_components/ImageUpload.js'
import PageReference from './entry_components/TextBox.js'
import WysiwygEditor from './entry_components/WysiwygEditor.js'
import DatePicker from './entry_components/DatePicker.js'
import YoutubeEmbed from './entry_components/YoutubeEmbed.js'
import EntryReference from './entry_components/EntryReference.js'
import FileUpload from './entry_components/FileUpload.js'

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

import axios from 'axios';



class Entry extends Component{
    constructor(props) {
        super(props);
        this.state = {
            components: this.props.location.state.structure.fields,
            structure: this.props.location.state.structure.slug
        }


        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        
    }
    
    handleFormSubmit(event) {
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);        
        let entryPayLoad = {
            data: {
                entryLog: this.state.components,
                slug: this.state.structure
            }
        };

        axios.post('/submit-entry', entryPayLoad).then((response) => {

            if(response.data.eror) {
                alert(response.data.error);
                return;
            }
            alert(response.data);
            this.props.history.push("/admin/structures");
        });
    }

    
    handleChange(event) {
        let placeholder = event.target.value;
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].label === event.target.name) {
                this.state.components[i].value = placeholder
            }
        }

        console.log(this.state.components);
    }

    handleCheckbox(event) {
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].label === event.target.name) {
                if(event.target.checked) {
                    this.state.components[i].value = true;
                } else {
                    this.state.components[i].value = false;
                }       
            }
        }
    }

    chooseComponent(structureComponent) {
        let valueToBePassed = "";

        for(let i = 0; i < this.state.components.length; i++) {
            if(structureComponent.label === this.state.components[i].label) {
                valueToBePassed = this.state.components[i].value;
            }
        }

        if(structureComponent.component === "text-input-string") {
            return (
                <div>
                    <TextBox data={structureComponent} handleInput={this.handleChange} value={valueToBePassed} />
                </div>
            )
        }
        else if(structureComponent.component === "text-input-number") {
            return (
                <div>
                    <NumberTextBox data={structureComponent} handleInput={this.handleChange} value={valueToBePassed} />
                </div>
            )
        }
        else if(structureComponent.component === "checkbox") {
            return (
                <div>
                    <CheckBox data={structureComponent} handleInput={this.handleCheckbox} value={valueToBePassed}/>
                </div>
            )
        }
        else if(structureComponent.component === "textarea") {
            return(
                <div>
                    <TextArea data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            ) 
        }
        else if(structureComponent.component === "image-upload") {
            return (
                <div>
                    <ImageUpload data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            )
        }
        else if(structureComponent.component === "link") {
            return (
                <div>
                    <PageReference data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            )
        }
        else if(structureComponent.component === "wysiwyg-editor") {
            return (
                <div>
                    <WysiwygEditor data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            )
        }
        else if(structureComponent.component === "datepicker") {
            return (
                <div>
                    <DatePicker data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            )   
        }
        else if(structureComponent.component === "youtube") {
            return (
                <div>
                    <YoutubeEmbed data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            ) 
        }
        else if(structureComponent.component === "reference-entry") {
            return (
                <div>
                    <EntryReference data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            ) 
        }
        else if(structureComponent.component === "upload-file") {
            return (
                <div>
                    <FileUpload data={structureComponent} handleInput={this.handleChange} value={valueToBePassed}/>
                </div>
            )
        }
    }
    
    render(){
        return(
            <form className="container" onSubmit={this.handleFormSubmit}>
                {this.state.components.map((element) => (
                    this.chooseComponent(element)
                ))}     
                <input
                    type="submit"
                    className="btn btn-primary float-right"
                    value="Submit" />
            </form>
        )
    }
}


export default Entry;