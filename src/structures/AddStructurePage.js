import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";
import Structure from "./Structure"

// structure components

// import TextBox from './structure_components/TextBox.js'
// import NumberTextBox from './structure_components/NumberTextBox.js'
// import CheckBox from './structure_components/CheckBox.js'
// import TextArea from './structure_components/TextArea.js'
// import ImageUpload from './structure_components/ImageUpload.js'
// import PageReference from './structure_components/TextBox.js'
// import WysiwygEditor from './structure_components/WysiwygEditor.js'
// import YoutubeEmbed from './structure_components/YoutubeEmbed.js'
// import EntryReference from './structure_components/EntryReference.js'
// import FileUpload from './structure_components/FileUpload.js'


class AddStructurePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            structureName: "",
            structureFields: [],
            currentSelectStructure: "text-input-string"
        }

        this.addStructure = this.addStructure.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleComponentChange = this.handleComponentChange.bind(this);
        this.sortComponents = this.sortComponents.bind(this);
        this.removeField = this.removeField.bind(this);
    }

    //sort code via stackoverflow 
    //https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
    sortComponents(a,b) { 
        if (a.component < b.component)
          return -1;
        if (a.component > b.component)
          return 1;
        return 0;
      }

    handleLabelChange(event) {
        this.setState({
            structureName: event.target.value
        })
    }

    handleComponentChange(event) {
        this.setState({
            currentSelectStructure: event.target.value
        })
    }

    addStructure(event) {
        setAuthorizationToken(localStorage.jwtToken);        
        axios.post("/add-structure", {structureName: this.state.structureName}).then(response => {
            if(response.data.error) {
                alert(response.data.error);
            }
        }); 
    }

    addComponent(event) {
        this.state.structureFields.push({
            label: this.state.structureName,
            component: this.state.currentSelectStructure
        });
        event.preventDefault();
        this.setState({
            structureFields: this.state.structureFields.sort(this.sortComponents)
        })
        console.log(this.state.structureFields);
    }

    removeField(event) {
        let filteredComponents = this.state.structureFields.filter((elements) => {
            return elements.label !== event.target.value
        });

        console.log("FILTERED");
        console.log(filteredComponents);

        this.setState({
            structureFields: filteredComponents
        });
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <h1>New Structure</h1>
                        <form onSubmit={this.addComponent}>
                            <input type="text" placeholder="Component Label" onChange={this.handleLabelChange}/>
                            <select value={this.state.currentSelectStructure} onChange={this.handleComponentChange}>     
                                <option value="text-input-string">Text Input</option>
                                <option value="text-input-number">Number Input</option>
                                <option value="checkbox">Checkbox</option>
                                <option value="textarea">Text Area</option>
                                <option value="image-upload">Image Upload</option>
                                <option value="link">Link</option>
                                <option value="wysiwyg-editor">WYSIWYG Editor</option>
                                <option value="datepicker">Datepicker</option>
                                <option value="youtube">Embeddable Youtube</option>
                                <option value="reference-entry">Reference Entry</option>
                                <option value="upload-file">Upload File</option>
                            </select>
                            <input className="btn btn-primary" type="submit" value="Add Component" placeholder="Component Label" />
                        </form>

                        <Structure components={this.state.structureFields} removeField={this.removeField}/>

                        <button className="btn btn-success" onClick={this.addStructure}>Add Structure</button>

                    </div>
                </div>
            </div> 
        );
    }
} 

export default AddStructurePage;