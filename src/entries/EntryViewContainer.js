import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

import TextBox from './entry_components/TextBox.js'
import NumberTextBox from './entry_components/NumberTextBox.js'
import CheckBox from './entry_components/CheckBox.js'
import TextArea from './entry_components/TextArea.js'
import ImageUpload from './entry_components/ImageUpload.js'
import PageReference from './entry_components/PageReference.js'
import WysiwygEditor from './entry_components/WysiwygEditor.js'
import DatePicker from './entry_components/DatePicker.js'
import YoutubeEmbed from './entry_components/YoutubeEmbed.js'
// import EntryReference from './entry_components/EntryReference.js'
import FileUpload from './entry_components/FileUpload.js'

import CommentContainer from '../comments/CommentContainer.js';
import CommentForm from '../comments/CommentForm.js';
import CommentList from '../comments/CommentList.js';


class EntryViewContainer extends Component {
    constructor(props) {
        super(props);

        let loggedin = false;
        if(localStorage.length === 0) {
            loggedin = false;
        } else {
            loggedin = true;
        }

        this.state = {
            comments: this.props.comments,
            isLoggedIn: loggedin
        }


        this.state = {
            entrySlug: this.props.match.params.entrySlug,
            structureSlug: this.props.match.params.structureSlug,
            title: "",
            description: "",
            fields: [],
            createdDate: "",
            comments: [],
            isLoggedIn: loggedin
        }

        this.getEntryDetail = this.getEntryDetail.bind(this);
        this.parseFields = this.parseFields.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }



    componentDidMount() {
        this.getEntryDetail();
    }

    submitComment(event) {
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);
        console.log("i was submitted");

        let submissionPayLoad = {
            data: {
                entrySlug: this.state.entrySlug,
                structureSlug: this.state.structureSlug,
                commentText: this.state.commentText,
                createdDate: moment().format('MM-DD-YYYY')
            }
        }

        axios.post('/submit-comment', submissionPayLoad).then((response) => {
            
            if(response.data.error) {
                alert(response.data.error);
                return;
            }

            console.log(response);

            this.getEntryDetail();
        });
    }


    getEntryDetail() {
        axios.get(`/public/${this.state.structureSlug}/${this.state.entrySlug}`).then((response) => {
            console.log(response);

            if(response.data.error) {
                alert("there was an error retrieving the entry");
                this.props.history.push("/structures");                
            }
            this.setState({
                title: response.data.title,
                description: response.data.description,
                fields: response.data.fields,
                createdDate: response.data.createdDate,
                comments: response.data.comments,
                author: response.data.author
            });
        });
    }  
    
    parseFields(element) {
        if(element.component === "text-input-string") {
            return (
                <div className="col-md-3">
                    <TextBox data={element}  />
                </div>
            )
        }
        else if(element.component === "text-input-number") {
            return (
                <div className="col-md-3">
                    <NumberTextBox data={element}  />
                </div>
            )
        }
        else if(element.component === "checkbox") {
            return (
                <div className="col-md-3">
                    <CheckBox data={element} />
                </div>
            )
        }
        else if(element.component === "textarea") {
            return(
                <div className="col-md-12">
                    <TextArea data={element} />
                </div>
            ) 
        }
        else if(element.component === "image-upload") {
            return (
                <div className="col-md-12">
                    <ImageUpload data={element} />
                </div>
            )
        }
        else if(element.component === "link") {
            return (
                <div className="col-md-3">
                    <PageReference data={element} />
                </div>
            )
        }
        else if(element.component === "wysiwyg-editor") {
            return (
                <div className="col-md-12">
                    <WysiwygEditor data={element} />
                </div>
            )
        }
        else if(element.component === "datepicker") {
            return (
                <div className="col-md-3">
                    <DatePicker data={element} />
                </div>
            )   
        }
        else if(element.component === "youtube") {
            return (
                <div className="col-md-12">
                    <YoutubeEmbed data={element} />
                </div>
            ) 
        }
        // else if(element.component === "reference-entry") {
        //     return (
        //         <div>
        //             <EntryReference data={element} />
        //         </div>
        //     ) 
        // }
        else if(element.component === "upload-file") {
            return (
                <div>
                    <FileUpload data={element} />
                </div>
            )
        }
    }

    render() {
        return(

            <div className="container">
                <h1>{this.state.title}</h1>
                <h2>{this.state.description}</h2>
                <div className="row">
                    {this.state.fields.map((element) => (
                    this.parseFields(element)
                    ))}     
                </div>  
                <CommentContainer comments={this.state.comments}/>
                {this.state.isLoggedIn === true ? (
                    <CommentForm entryDetail={this.state} submitComment={this.submitComment} />  
                ): (
                    <p></p>
                )
                }
            </div>

        )
    }
}

export default EntryViewContainer;