import React, { Component } from 'react';

class ImageUpload extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div>
                <h1>{this.props.data.label}</h1>
                <form method="POST">
                    <input type="file" name="image" />
                    <input type="submit" className="btn btn-primary" />
                </form>
        </div>
        )
    }
}

export default ImageUpload;


