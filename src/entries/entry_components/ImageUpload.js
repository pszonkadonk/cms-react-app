import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null
        }
    }

    async componentDidMount() {
        let imagePath;
        let myImage;
        if(this.props.data.value) {
            let imagePath = this.props.data.value.split('/')[4]
            myImage = await import(`../../client/pictures/${imagePath}`);   
            this.setState({
                image: myImage
            });             
        }
        else {
            imagePath = "";
        }
    }

    render() {
        return(
            <div class="form-group">
            <Dropzone name={this.props.data.label} multiple={false} accept={'image/*'} onDrop={this.props.dropPhoto} onChange={this.props.changeThings}>
                <h5>{this.props.data.label}</h5>
                <p> Drop a photo, or click to add. </p>                
            </Dropzone>
            {this.state.image ? (
                    <img src={this.state.image} style={{width: 200, height: 200}}/>
            ): (
                    <p></p>
            )
            }
            </div>
        );
    }
}

export default ImageUpload;


{/* <input type="file" name="image" />
                    <input type="submit" className="btn btn-primary" /> */}
