import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

// structure components

import TextBox from '../structures/structure_components/TextBox.js'
import NumberTextBox from '../structures/structure_components/NumberTextBox.js'
import CheckBox from '../structures/structure_components/CheckBox.js'
import TextArea from '../structures/structure_components/TextArea.js'
import ImageUpload from '../structures/structure_components/ImageUpload.js'
import PageReference from '../structures/structure_components/TextBox.js'
import WysiwygEditor from '../structures/structure_components/WysiwygEditor.js'
import DatePicker from '../structures/structure_components/DatePicker.js'
import YoutubeEmbed from '../structures/structure_components/YoutubeEmbed.js'
import EntryReference from '../structures/structure_components/EntryReference.js'
import FileUpload from '../structures/structure_components/FileUpload.js'



class Entry extends Component{
    constructor(props) {
        super(props);
        this.state = {
            components: this.props.components
        }
        this.chooseComponent = this.chooseComponent.bind(this);
        this.midway = this.midway.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            components: nextProps.components
        });
    }


     midway(keyValuePair) {
        this.props.dataPassThrough(keyValuePair);
     }







    chooseComponent(structureComponent) {
        if(structureComponent.component === "text-input-string") {
            return (
                <div>
                    <TextBox data={structureComponent} send={this.midway}/>
                </div>
            )
        }
        else if(structureComponent.component === "text-input-number") {
            return (
                <div>
                    <NumberTextBox data={structureComponent} send={this.midway} />
                </div>
            )
        }
        else if(structureComponent.component === "checkbox") {
            return (
                <div>
                    <CheckBox data={structureComponent} send={this.midway} />
                </div>
            )
        }
        else if(structureComponent.component === "textarea") {
            return(
                <div>
                    <TextArea data={structureComponent} send={this.midway}/>
                </div>
            ) 
        }
        else if(structureComponent.component === "image-upload") {
            return (
                <div>
                    <ImageUpload data={structureComponent} send={this.midway}/>
                </div>
            )
        }
        else if(structureComponent.component === "link") {
            return (
                <div>
                    <PageReference data={structureComponent} send={this.midway} />
                </div>
            )
        }
        else if(structureComponent.component === "wysiwyg-editor") {
            return (
                <div>
                    <WysiwygEditor data={structureComponent} send={this.midway} />
                </div>
            )
        }
        else if(structureComponent.component === "datepicker") {
            return (
                <div>
                    <DatePicker data={structureComponent} send={this.midway}/>
                </div>
            )   
        }
        else if(structureComponent.component === "youtube") {
            return (
                <div>
                    <YoutubeEmbed data={structureComponent} send={this.midway} />
                </div>
            ) 
        }
        else if(structureComponent.component === "reference-entry") {
            return (
                <div>
                    <EntryReference data={structureComponent} send={this.midway} />
                </div>
            ) 
        }
        else if(structureComponent.component === "upload-file") {
            return (
                <div>
                    <FileUpload data={structureComponent} send={this.midway}/>
                </div>
            )
        }
    }
    
    render(){
        return(
            <div>
                {this.state.components.map((element) => (
                    this.chooseComponent(element)
                ))}     
            </div>
        )
    }
}


export default Entry;