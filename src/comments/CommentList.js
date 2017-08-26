import React, { Component } from "react";


const CommentList = (props) => { 
    console.log(props)    
        return (
            <div>
                <h4>I am a comment List</h4>
                {props.userComments.map((comment) => (
                    <div>
                        <p>{comment.commentText}</p>
                        <p>by {comment.author}</p>
                        <p>on {comment.createdDate}</p>
                    </div>
                ))}
            </div>
        );
}


export default CommentList;