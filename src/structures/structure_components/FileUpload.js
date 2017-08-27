import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class FileUpload extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Dropzone name={this.props.data.label} multiple={false} onDrop={this.props.dropFile} onChange={this.props.uploadFile}>
                <h5>{this.props.data.label}</h5>
                <p> Drop a file, or click to add. </p>                
            </Dropzone>
        );
    }
}

export default FileUpload;


