import React, { Component } from 'react';
import axios from 'axios';

import setAuthorizationToken from "../utils/setAuthorizationToken.js";
import Structure from "./Structure"


class AddStructurePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            structureName: "",
            structureSlug: "",
            structureDescription: "",
            structurePageSize: 1,
            structureFields: [],
            currentSelectStructure: "text-input-string",
            componentLabelName: ""
        }

        this.addStructure = this.addStructure.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleComponentChange = this.handleComponentChange.bind(this);
        this.handleStructureNameChange = this.handleStructureNameChange.bind(this);
        this.handleStructureSlugChange = this.handleStructureSlugChange.bind(this);
        this.handleStructureDescriptionChange = this.handleStructureDescriptionChange.bind(this);
        this.handleStructurePageSizeChange = this.handleStructurePageSizeChange.bind(this);
        this.isValidStructure = this.isValidStructure.bind(this);


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
            componentLabelName: event.target.value
        })
    }

    handleComponentChange(event) {
        this.setState({
            currentSelectStructure: event.target.value
        })
    }

    handleStructureNameChange(event) {
        this.setState({
            structureName: event.target.value
        });
    }

    handleStructureSlugChange(event) {
        this.setState({
            structureSlug: event.target.value
        });
    }

    handleStructureDescriptionChange(event) {
        this.setState({
            structureDescription: event.target.value
        });
    }

    handleStructurePageSizeChange(event) {
        this.setState({
            structurePageSize: event.target.value
        });
    }

    addStructure(event) {
        event.preventDefault();
        setAuthorizationToken(localStorage.jwtToken);
        if(this.isValidStructure() === false) {
            alert("There was an issue validating your form " +
                    "please make sure all fields and filled in, and that your slug has no spaces")
            return;
        }

        axios.post("/add-structure", {
            structureName: this.state.structureName,
            structureSlug: this.state.structureSlug,
            structureDescription: this.state.structureDescription,
            structurePageSize: this.state.structurePageSize,
            structureFields: this.state.structureFields
        }).then(response => {
            if(response.data.error) {
                alert(response.data.error);
            }
            else {
                alert(`You have successfully created the ${this.state.structureName} structure!`);
                this.props.history.push("/admin/structures")
            }
        }); 
    }

    isValidStructure() {
        if(this.state.structureName === "undefined" || this.state.structureName === "") {
            console.log("failed because of name");
            return false;
        }
        else if(this.state.structureSlug === "undefined" || this.state.structureSlug === "") {
            console.log("failed because of skgu");
            return false;
        }
        else if(this.state.structureSlug.indexOf(" ") >=0 || this.state.structureName.indexOf(" ") >= 0) { //must have no spaces
            console.log("failed because of slug spaces");
            return false;
        }
        else if(this.state.structureDescription === "undefined" || this.state.structureDescription === "") {
            console.log("failed because of decsription");
            return false;
        }
        else if(this.state.structurePageSize === "undefined" || this.state.structurePageSize === "" || this.state.structurePageSize <= 0) {
            console.log("failed because of page size");
            return false
        }
        else if(this.state.structureFields === "undefined" || this.state.structureFields.length === 0) {
            console.log("failed because of structure fields");
            return false
        }
    }

    addComponent(event) {
        this.state.structureFields.push({
            label: this.state.componentLabelName,
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
                    <div className="col-md-6 offset-md-3">
                        <h1>Create New Structure</h1>
                        <h2>Structure Detail</h2>
                        <form onSubmit={this.addStructure}>
                            <div className="form-group">
                                <label htmlFor="structureName">Structure Name</label>
                                <input type="text" className="form-control" id="structureName" aria-describedby="structureNameHelp" placeholder="Enter Structure Name" value={this.state.structureName} onChange={this.handleStructureNameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="structureSlug">Structure Slug</label>
                                <input type="text" className="form-control" id="structureSlug" aria-describedby="structureSlugHelp" placeholder="Enter Structure Name" value={this.state.structureSlug} onChange={this.handleStructureSlugChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="structureDescription">Structure Description</label>
                                <input type="text" className="form-control" id="structureDescription" aria-describedby="structureDescriptionHelp" placeholder="Enter Structure Description" value={this.state.structureDescription} onChange={this.handleStructureDescriptionChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="structurePageSize">Structure Page Size</label>
                                <input type="number" className="form-control" id="structurePageSize" aria-describedby="structurePageSizeHelp" placeholder="Enter Structure Page Size" value={this.state.structurePageSize} onChange={this.handleStructurePageSizeChange} />
                            </div>
                        <button className="btn btn-success" onClick={this.addStructure}>Add Structure</button>
                        </form>


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


                    </div>
                </div>
            </div> 
        );
    }
} 

export default AddStructurePage;