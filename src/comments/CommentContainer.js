import React, { Component } from "react";

import CommentList from './CommentList.js';
import CommentForm from './CommentForm.js';


class CommentContainer extends Component { 
    constructor(props) {
        super(props)


    }
    render() {
        return (
            <div>
                <CommentList userComments={this.props.comments} />
            </div>   
        );
    }




}


export default CommentContainer;