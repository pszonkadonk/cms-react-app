import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6

import theme from 'react-quill/dist/quill.snow.css';

class WysiwygEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
         } 
        this.handleChange = this.handleChange.bind(this)
      }
    
      handleChange(value) {
        this.setState({
             text: value
        });
      }
    
      render() {
        return (
          <ReactQuill onChange={this.handleChange} />
        )
      }
}

export default WysiwygEditor;