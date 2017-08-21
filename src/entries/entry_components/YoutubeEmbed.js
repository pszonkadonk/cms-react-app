import React, { Component } from 'react';

class YoutubeEmbed extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return(
            <div>
                <label>{this.props.data.label}</label>
                <input type="text" />
            </div>
        )
    }
}

export default YoutubeEmbed;