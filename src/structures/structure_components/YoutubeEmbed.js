import React, { Component } from 'react';

class YoutubeEmbed extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(props);
        return(
            <div>
                <label>{props.data.label}</label>
                <input type="text" />
            </div>
        )
    }
}

export default YoutubeEmbed;