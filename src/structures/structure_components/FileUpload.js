import React, { Component } from 'react';

class FileUpload extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div>
                <label>{this.props.data.label}</label>
                <form method="POST">
                    <input type="file" name="file" />
                    <input type="submit" className="btn btn-primary" />
                </form>
        </div>
        )
    }
}

export default FileUpload;


