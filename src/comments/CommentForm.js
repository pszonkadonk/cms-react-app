import React, { Component } from "react";
import axios from 'axios';
import moment from 'moment';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";

const CommentForm = (props) => { 
    return (
        <div class="form-group">
            <form onSubmit={props.submitComment}>
                <label>Comment:</label>
                <textarea value={props.comment} onChange={props.writingComment} rows="4" cols="50"></textarea>
                <input type="submit" className="btn btn-primary" placeholder="Add Comment" />
            </form>
        </div>   
    );
    
}


export default CommentForm;