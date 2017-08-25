import React, { Component } from 'react';

import axios from 'axios';

import TextBox from './entry_components/TextBox.js'
import NumberTextBox from './entry_components/NumberTextBox.js'
import CheckBox from './entry_components/CheckBox.js'
import TextArea from './entry_components/TextArea.js'
import ImageUpload from './entry_components/ImageUpload.js'
import PageReference from './entry_components/PageReference.js'
import WysiwygEditor from './entry_components/WysiwygEditor.js'
import DatePicker from './entry_components/DatePicker.js'
import YoutubeEmbed from './entry_components/YoutubeEmbed.js'
import EntryReference from './entry_components/EntryReference.js'
import FileUpload from './entry_components/FileUpload.js'

import moment from 'moment';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

class EditEntryContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            structureSlug: this.props.match.params.slug,
            entrySlug: this.props.match.params.entrySlug,
            title: "",
            description: "",
            fields: []
        }

        this.getEntryDetail = this.getEntryDetail.bind(this);
        this.parseFields = this.parseFields.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.dropHandler = this.dropHandler.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChangeEditor = this.handleChangeEditor.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleAddVideo = this.handleAddVideo.bind(this);
        this.editDropHandler = this.editDropHandler.bind(this);

    }

    componentDidMount() {
        this.getEntryDetail();
    }
    

    getEntryDetail() {
        setAuthorizationToken(localStorage.jwtToken);                    
        axios.get(`/${this.state.structureSlug}/${this.state.entrySlug}`).then((response) => {
            console.log(response);

            if(response.data.error) {
                alert("there was an error retrieving the entry");
                this.props.history.push("/admin/structures");                
            }

            this.setState({
                title: response.data.title,
                description: response.data.description,
                fields: response.data.fields
            });
        });
    }

    parseFields(element) {
        console.log(element);

        if(element.component === "text-input-string") {
            return (
                <div>
                    <TextBox data={element} handleInput={this.handleChange}  />
                </div>
            )
        }
        else if(element.component === "text-input-number") {
            return (
                <div>
                    <NumberTextBox data={element} handleInput={this.handleChange}  />
                </div>
            )
        }
        else if(element.component === "checkbox") {
            return (
                <div>
                    <CheckBox data={element} handleInput={this.handleCheckbox} />
                </div>
            )
        }
        else if(element.component === "textarea") {
            return(
                <div>
                    <TextArea data={element} handleInput={this.handleChange} />
                </div>
            ) 
        }
        else if(element.component === "image-upload") {
            return (
                <div>
                    <ImageUpload data={element} dropPhoto={this.editDropHandler} changeThings={this.handleImageChange}/>
                </div>
            )
        }
        else if(element.component === "link") {
            let targetLink = element.value
            return (
                <div>
                    <PageReference data={element} handleInput={this.handleChange} value={targetLink} />
                </div>
            )
        }
        else if(element.component === "wysiwyg-editor") {
            return (
                <div>
                    <WysiwygEditor data={element} handleInput={this.handleChangeEditor} />
                </div>
            )
        }
        else if(element.component === "datepicker") {
            let parsedDate = moment(element.value);
            return (
                <div>
                    <DatePicker data={element} handleInput={this.handleDateChange} value = {parsedDate} />
                </div>
            )   
        }
        else if(element.component === "youtube") {
            return (
                <div>
                    <YoutubeEmbed data={element} handleInput={this.handleAddVideo} />
                </div>
            ) 
        }
        else if(element.component === "reference-entry") {
            return (
                <div>
                    <EntryReference data={element} handleInput={this.handleChange} />
                </div>
            ) 
        }
        else if(element.component === "upload-file") {
            return (
                <div>
                    <FileUpload data={element} dropFile={this.dropHandler} />
                </div>
            )
        }
    }


    handleTitleChange(event) {
        this.setState({
          title: event.target.value  
        });
    }

    handleDescriptionChange(event) {
        this.setState({
          description: event.target.value  
        });
    }

    handleFormSubmit(event) { //must be changed (redirected to do an update to previous entry, rather then a full post )
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);        
        let entryPayLoad = {
            data: {
                fields: this.state.fields,
                structureSlug: this.state.structureSlug,
                entrySlug: this.state.entrySlug,  // the entries unique identifier
                title: this.state.title,
                description: this.state.description,
                author: "author",
                createdDate: this.state.createdDate,
                comments: this.state.comments
            }
        };

        console.log(entryPayLoad);

        axios.put('/update-entry', entryPayLoad).then((response) => {
            console.log("I updated!");

            if(response.data.error) {
                alert(response.data.error);
                return;
            }
            alert("You have successfully updated the entry");
            this.props.history.push("/admin/structures");
        });
    }

    handleImageChange(event) {
        console.log("Hi rom handle image change");
        console.log(event.target);
    }
    
    handleChange(event) {
        let placeholder = event.target.value;
        for(let i = 0; i < this.state.fields.length; i++) {
            if(this.state.fields[i].label === event.target.name) {
                this.state.fields[i].value = placeholder
            }
        }
        this.setState({
            fields: this.state.fields
        });
        console.log(this.state.fields);
    }

    handleChangeEditor(text) {
        console.log(text);
        for(let i = 0; i < this.state.fields.length; i++) {
            if(this.state.fields[i].component === "wysiwyg-editor") {
                this.state.fields[i].value = text
            }
        }
        this.setState({
            fields: this.state.fields
        });
        console.log(this.state.fields);
    }

    handleCheckbox(event) {
        for(let i = 0; i < this.state.components.length; i++) {
            if(this.state.fields[i].label === event.target.name) {
                if(event.target.checked) {
                    this.state.fields[i].value = true;
                } else {
                    this.state.fields[i].value = false;
                }       
            }
        }
        this.setState({
            fields: this.state.fields
        });

        console.log(this.state.fields);
    }

    handleDateChange(date) {
        console.log(date);
        for(let i = 0; i < this.state.fields.length; i++) {
            if(this.state.fields[i].component === "datepicker") {
                console.log("date sholud be changed");
                this.state.fields[i].value = date
                break;
            }
        }
        this.setState({
            fields: this.state.fields
        });
    }

    handleAddVideo(event) {
        console.log(event.target.value);
        let placeholder = event.target.value;
        for(let i = 0; i < this.state.fields.length; i++) {
            if(this.state.fields[i].label === event.target.name) {
                this.state.fields[i].value = placeholder
            }
        }
        this.setState({
            fields: this.state.fields
        });
        console.log(this.state.fields);
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
    
                for(let i = 0; i < this.state.fields.length; i++) { //add image path to image tag for db
                    if(this.state.fields[i].component === "image-upload" && this.state.fields[i].value === undefined) {
                        console.log("it is true!");
                        this.state.fields[i].value = response.data.path;
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
    
                for(let i = 0; i < this.state.fields.length; i++) { //add image path to image tag for db
                    if(this.state.fields[i].component === "upload-file" && this.state.fields[i].value === undefined) {
                        this.state.fields[i].value = response.data.path;
                        break;
                    }
                }
            });
        }
    }

    editDropHandler (file) {
        console.log(file)
        setAuthorizationToken(localStorage.jwtToken);                        
        let fileType = file[0].type.split('/')[0]
        if(fileType === 'image') {
            let photo = new FormData();
            photo.append('photo', file[0]);
            photo.append('entrySlug', this.state.entrySlug);
            photo.append('structureSlug', this.state.structureSlug);
            // photo.append('entrySlug', );  

    
            axios.post('/edit-upload-image', photo).then((response) => {
                console.log("response from posting image");
                console.log(response);
    
                for(let i = 0; i < this.state.fields.length; i++) { //add image path to image tag for db
                    if(this.state.fields[i].component === "image-upload") {
                        console.log("it is true!");
                        this.state.fields[i].value = response.data.path;
                        break;
                    }
                }
            });
        }
        else {
            let uploadedFile = new FormData();
            uploadedFile.append('file', file[0]);
            
            axios.post('/edit-upload-file', uploadedFile).then((response) => {
                console.log("response from file upload");
                console.log(response);
    
                for(let i = 0; i < this.state.fields.length; i++) { //add image path to image tag for db
                    if(this.state.fields[i].component === "upload-file" && this.state.fields[i].value === undefined) {
                        this.state.fields[i].value = response.data.path;
                        break;
                    }
                }
            });
        }

        this.setState({
            fields: this.state.fields
        })

    }

            
        render() {
            return(
                <form className="container" onSubmit={this.handleFormSubmit}>
                    <h1>Entry Detail</h1>
                    <label>Entry Title</label>
                    <input name="entry-title" type="text" value={this.state.title} onChange={this.handleTitleChange} />
                    <label>Entry Description</label>
                    <input name="entry-description" type="text" value={this.state.description} onChange={this.handleDescriptionChange} />
                    <h2>Entry Components</h2>
                    {this.state.fields.map((element) => (
                        this.parseFields(element)
                    ))}     
                    <input
                        type="submit"
                        className="btn btn-primary float-right"
                        value="Submit" />
                </form>
            )
        }
}

    

export default EditEntryContainer;