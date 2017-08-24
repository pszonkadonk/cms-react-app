import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import moment from 'moment';

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
            structure: this.props.location.state.structure.slug,
            entryTitle: "",
            description: "",
            entrySlug: "",
            author: "author",
            createdDate: moment().format('MM-DD-YYYY'),
            components: this.props.location.state.structure.fields,
            comments: []            
        }
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChangeEditor = this.handleChangeEditor.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAddVideo = this.handleAddVideo.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleEntrySlugChange = this.handleEntrySlugChange.bind(this);

    }


    handleTitleChange(event) {
        this.setState({
          entryTitle: event.target.value  
        });
    }

    handleDescriptionChange(event) {
        this.setState({
          description: event.target.value  
        });
    }

    handleEntrySlugChange(event) {
        this.setState({
            entrySlug: event.target.value
        });
    }
    
    
    handleFormSubmit(event) {
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);        
        let entryPayLoad = {
            data: {
                entryLog: this.state.components,
                slug: this.state.structure,
                entrySlug: this.state.entrySlug,  // the entries unique identifier
                title: this.state.entryTitle,
                description: this.state.description,
                author: "author",
                createdDate: this.state.createdDate,
                comments: this.state.comments
            }
        };

        console.log(entryPayLoad);

        axios.post('/submit-entry', entryPayLoad).then((response) => {
            console.log("I submitted!");

            if(response.data.error) {
                alert(response.data.error);
                return;
            }
            alert(response.data);
            this.props.history.push("/admin/structures");
        });
    }

    handleImageChange(event) {
        console.log("Hi rom handle image change");
        console.log(event.target);
    }
    
    handleChange(event) {
        let placeholder = event.target.value;
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].label === event.target.name) {
                this.state.components[i].value = placeholder
            }
        }
        this.setState({
            components: this.state.components
        });
        console.log(this.state.components);
    }

    handleChangeEditor(text) {
        console.log(text);
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].component === "wysiwyg-editor") {
                this.state.components[i].value = text
            }
        }
        this.setState({
            components: this.state.components
        });
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
        this.setState({
            components: this.state.components
        });

        console.log(this.state.components);
    }

    handleDateChange(date) {
        console.log(date);
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].component === "datepicker") {
                console.log("date sholud be changed");
                this.state.components[i].value = date.add
                break;
            }
        }
        this.setState({
            components: this.state.components
        });
    }

    handleAddVideo(event) {
        console.log(event.target.value);
        let placeholder = event.target.value;
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.components[i].label === event.target.name) {
                this.state.components[i].value = placeholder
            }
        }
        this.setState({
            components: this.state.components
        });
        console.log(this.state.components);
    }
    
    dropHandler(file) {
        console.log(file)
        setAuthorizationToken(localStorage.jwtToken);                        
        let fileType = file[0].type.split('/')[0]
        if(fileType === 'image') {
            let photo = new FormData();
            photo.append('photo', file[0]);
    
            axios.post('/upload-image', photo).then((response) => {
                console.log("response from posting image");
                console.log(response);
    
                for(let i = 0; i < this.state.components.length; i++) { //add image path to image tag for db
                    if(this.state.components[i].component === "image-upload" && this.state.components[i].value === undefined) {
                        console.log("it is true!");
                        this.state.components[i].value = response.data.path;
                        break;
                    }
                }
            });
        }
        else {
            let uploadedFile = new FormData();
            uploadedFile.append('file', file[0]);
            
            axios.post('/upload-file', uploadedFile).then((response) => {
                console.log("response from file upload");
                console.log(response);
    
                for(let i = 0; i < this.state.components.length; i++) { //add image path to image tag for db
                    if(this.state.components[i].component === "upload-file" && this.state.components[i].value === undefined) {
                        this.state.components[i].value = response.data.path;
                        break;
                    }
                }
            });
        }
    }

    chooseComponent(structureComponent) {
        let valueToBePassed = "";

        for(let i = 0; i < this.state.components.length; i++) {
            if(structureComponent.label === this.state.components[i].label) {
                console.log("Value to be passed for " + structureComponent.label)
                console.log(structureComponent.component + " : ")
                console.log(this.state.components[i].value);                
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
                    <ImageUpload data={structureComponent} dropPhoto={this.dropHandler} changeThings={this.handleImageChange}/>
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
                    <WysiwygEditor data={structureComponent} handleInput={this.handleChangeEditor} value={valueToBePassed}/>
                </div>
            )
        }
        else if(structureComponent.component === "datepicker") {
            // valueToBePassed = moment()
            return (
                <div>
                    <DatePicker data={structureComponent} handleInput={this.handleDateChange} value={valueToBePassed}/>
                </div>
            )   
        }
        else if(structureComponent.component === "youtube") {
            return (
                <div>
                    <YoutubeEmbed data={structureComponent} handleInput={this.handleAddVideo} value={valueToBePassed}/>
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
                    <FileUpload data={structureComponent} dropFile={this.dropHandler} value={valueToBePassed}/>
                </div>
            )
        }
    }
    
    render(){
        
        return(
            <form className="container" onSubmit={this.handleFormSubmit}>
                <h1>Entry Detail</h1>
                <label>Entry Title</label>
                <input name="entry-title" type="text" value={this.state.entryTitle} onChange={this.handleTitleChange} />
                <label>Entry Description</label>
                <input name="entry-description" type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
                <label>Entry Slug</label>
                <input name="entry-slug" type="text" value={this.state.entrySlug} onChange={this.handleEntrySlugChange} />
                <h2>Entry Components</h2>
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