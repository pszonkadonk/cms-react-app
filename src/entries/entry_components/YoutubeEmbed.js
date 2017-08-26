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
            playerVars: { 
              autoplay: 1
            }
          };      
        return(
            <div class="form-group">
                <h2>{this.props.data.label}</h2>
                <YouTube
                    videoId={this.props.data.value}
                    opts={opts}
                    onReady={this._onReady}
                    />
            </div>
        )
    }
}

export default YoutubeEmbed;