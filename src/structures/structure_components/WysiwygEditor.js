import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6

import theme from 'react-quill/dist/quill.snow.css';

class WysiwygEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
         } 
      }
    
    
      render() {
        return (
          <ReactQuill name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
        )
      }
}

export default WysiwygEditor;