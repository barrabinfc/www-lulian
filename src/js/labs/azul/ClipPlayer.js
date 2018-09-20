/**
 * Play listeners
 */
export default class ClipPlayer {
    constructor( clipElement, youtubeID ){
        this.playing = false;
        this.clip  = clipElement;
        this.player = new YT.Player(clipElement, {
            videoId: youtubeID,
            origin: 'http://localhost:3000',
            events: {
                'onReady': this.ready,
            }
        })
    }

    play( ){
        this.player.playVideo();
        this.playing = true;
    }

    pause(){
        this.player.stopVideo();
        this.playing = false;
    }

    toggle(){
        (this.playing ? this.pause() : this.play() );
    }

    ready(){

    }
}