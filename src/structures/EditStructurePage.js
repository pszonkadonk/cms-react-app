import React, { Component } from 'react';
import axios from 'axios';
import Structure from './Structure.js';
import setAuthorizationToken from "../utils/setAuthorizationToken.js";


class EditStructurePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            structureName: this.props.location.state.structure.name,
            structureDescription: this.props.location.state.structure.description,
            structurePageSize: this.props.location.state.structure.pageSize,
            componentLabelName: "",
            currentSelectStructure: "text-input-string",
            structureFields: this.props.location.state.structure.fields
        }

        this.handleLabelChange = this.handleLabelChange.bind(this);
        this.handleComponentChange = this.handleComponentChange.bind(this);
        this.updateStructure = this.updateStructure.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.removeField = this.removeField.bind(this);      
        this.sortComponents = this.sortComponents.bind(this);  

        this.handleStructureNameChange = this.handleStructureNameChange.bind(this);
        this.handleStructureDescriptionChange = this.handleStructureDescriptionChange.bind(this);
        this.handleStructurePageSizeChange = this.handleStructurePageSizeChange.bind(this);

    }

    updateStructure(event){
        event.preventDefault();  
        setAuthorizationToken(localStorage.jwtToken);        
        let updatedStructure = {}
        //structure name
        if(this.state.structureName === "undefined" || this.state.structureName === "") {
            updatedStructure.name = this.props.location.state.structure.name
        } else {
            updatedStructure.name = this.state.structureName
        }
        //structure description
        if(this.state.structureDescription === "undefined" || this.state.structureDescription === "") {
            updatedStructure.description = this.props.location.state.structure.description
        } else {
            updatedStructure.description = this.state.structureDescription
        }
        //structure page size
        if(this.state.pageSize === "undefined" || this.state.pageSize === "") {
            updatedStructure.pageSize = this.props.location.state.structure.pageSize
        } else {
            updatedStructure.pageSize = this.state.structurePageSize
        }

        updatedStructure.fields = this.state.structureFields;
        updatedStructure.slug = this.props.location.state.structure.slug //permanent slug id

        console.log(updatedStructure);

        axios.put("/update-structure", updatedStructure).then((response) => {
            
            if(response.data.error) {
                alert("Failed to update structure")
            }
            else {
                this.setState({
                    structureName: response.data.name,
                    structureDescription: response.data.description,
                    structurePageSize: response.data.pageSize,
                    structureFields: response.data.fields
                });
                alert(`You have updated the ${response.data.name} strucure.  Slug ID: (${response.data.slug})`);
            }

            this.props.history.push("/admin/structures");
        });
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

    sortComponents(a,b) { 
        if (a.component < b.component)
          return -1;
        if (a.component > b.component)
          return 1;
        return 0;
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
                        <h1>Edit Structure</h1>
                        <h2>Structure Detail</h2>
                        <form onSubmit={this.updateStructure}>
                            <div className="form-group">
                                <label htmlFor="structureName">Structure Name</label>
                                <input type="text" className="form-control" id="structureName" aria-describedby="structureNameHelp" placeholder="Enter Structure Name" value={this.state.structureName} onChange={this.handleStructureNameChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="structureDescription">Structure Description</label>
                                <input type="text" className="form-control" id="structureDescription" aria-describedby="structureDescriptionHelp" placeholder="Enter Structure Description" value={this.state.structureDescription} onChange={this.handleStructureDescriptionChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="structurePageSize">Structure Page Size</label>
                                <input type="number" className="form-control" id="structurePageSize" aria-describedby="structurePageSizeHelp" placeholder="Enter Structure Page Size" value={this.state.structurePageSize} onChange={this.handleStructurePageSizeChange} />
                            </div>
                        <button className="btn btn-success" onClick={this.updateStructure}>Update Structure</button>
                        </form>

                        <h1>Structure Components</h1>
                        <Structure components={this.state.structureFields} removeField={this.removeField}/>
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


                    </div>
                </div>
            </div> 
        );
    }
} 

export default EditStructurePage;