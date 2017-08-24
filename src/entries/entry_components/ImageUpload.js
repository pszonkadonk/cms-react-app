import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Dropzone name={this.props.data.label} multiple={false} accept={'image/*'} onDrop={this.props.dropPhoto} onChange={this.props.changeThings}>
                <h5>{this.props.data.label}</h5>
                <p> Drop a photo, or click to add. </p>                
            </Dropzone>
        );
    }
}

export default ImageUpload;


{/* <input type="file" name="image" />
                    <input type="submit" className="btn btn-primary" /> */}
