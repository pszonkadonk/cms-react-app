import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6

import theme from 'react-quill/dist/quill.snow.css';
import renderHTML from 'react-render-html';

class WysiwygEditor extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editorText: []
        }
    }
    
    render() {
        return (
            <div className="form-group">
                <h2>{this.props.data.label}</h2>
                <div>
                    {renderHTML(this.props.data.value)}
                </div>
                {/* {this.state.editorText.map((element) => (
                    this.parseFields(element)
                ))}             */}
            </div>
        )    
    }
}


export default WysiwygEditor;