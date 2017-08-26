import React, { Component } from "react";


const CommentList = (props) => { 
    console.log(props)    
        return (
            <div className="container">
                <h4>Comment List</h4>
                {props.userComments.map((comment) => (
                    <div className="comment" >
                        <div className="comment-detail">
                            User: {comment.author}<br />
                            On: {comment.createdDate}
                        </div>
                        <div className="comment-text">
                            {comment.commentText}
                        </div>
                    </div>
                ))}
            </div>
        );
}


export default CommentList;