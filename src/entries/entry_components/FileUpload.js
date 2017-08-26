import React, { Component } from 'react';
import FileDownload from 'react-file-download';

import axios from 'axios';


class FileUpload extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            filePath: this.props.data.value
        }

        this.getFile = this.getFile.bind(this);        
    }


    getFile(event) {
        event.preventDefault();
        let fileName = this.state.filePath.split('/')[4];
        let fileNameZip = fileName + '.zip';
        console.log(fileName);
        axios.get(`/download/${fileName}`).then((response) => {
            console.log(response);
            FileDownload(response.data, fileNameZip )
        })
    }

    render() {
        return(
            <div>
                <form className="form-group">
                    <h5>{this.props.data.label}</h5>
                    <input type="submit" className="btn btn-primary" onClick={this.getFile} />
                </form>
            </div>
        );
    }
}


export default FileUpload;


