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
    }


    handleCommentChange(event) {
        this.setState({
            commentText: event.target.value
        })
    }




    render() {
        console.log(this.props.entryDetail)
        return (
            <div class="form-group">
                <form onSubmit={this.props.submitComment}>
                    <label>Comment:</label>
                    <textarea value={this.state.commentText} onChange={this.handleCommentChange} rows="4" cols="50"></textarea>
                    <input type="submit" className="btn btn-primary" placeholder="Add Comment" />
                </form>
            </div>   
        );
    }




}


export default CommentForm;