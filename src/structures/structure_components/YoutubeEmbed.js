import React, { Component } from 'react';

import YouTube from 'react-youtube';


class YoutubeEmbed extends Component {
    constructor(props) {
        super(props);

        this._onReady = this._onReady.bind(this);
    }


    _onReady(event) {
        // access to player in all event handlers via event.target 
        event.target.pauseVideo();
      }
    
    render() {
        const opts = {
            height: '390',
            width: '640',
            playerVars: { // https://developers.google.com/youtube/player_parameters 
              autoplay: 1
            }
          };      
        console.log(this.props);
        return(
            <div class="form-group">
                <label>{this.props.data.label}</label>
                <YouTube
                    videoId={this.props.data.value}
                    opts={opts}
                    onReady={this._onReady}
                    />
                <label name={this.props.data.label}>Video Id</label>
                <input name={this.props.data.label} type="text" value={this.props.data.value} onChange={this.props.handleInput} />
            </div>
        )
    }
}

export default YoutubeEmbed;