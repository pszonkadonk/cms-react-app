import React, { Component } from "react";
import axios from 'axios';
import moment from 'moment';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

class CommentForm extends Component { 
    constructor(props) {
        super(props)

        this.state = {
            commentText: ""
        }

        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.submitComment = this.submitComment.bind(this);
    }


    handleCommentChange(event) {
        this.setState({
            commentText: event.target.value
        })
    }

    submitComment(event) {
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);
        console.log("i was submitted");

        let submissionPayLoad = {
            data: {
                entrySlug: this.props.entryDetail.entrySlug,
                structureSlug: this.props.entryDetail.structureSlug,
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





        })

    }



    render() {
        console.log(this.props.entryDetail)
        return (
            <div class="form-group">
                <form onSubmit={this.submitComment}>
                    <label>Comment:</label>
                    <textarea value={this.state.commentText} onChange={this.handleCommentChange} rows="4" cols="50"></textarea>
                    <input type="submit" className="btn btn-primary" placeholder="Add Comment" />
                </form>
            </div>   
        );
    }




}


export default CommentForm;