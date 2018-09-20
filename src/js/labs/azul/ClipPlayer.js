/**
 * Play listeners
 */
export default class ClipPlayer {
    constructor( clipElement, youtubeID ){
        this.playing = false;
        this.clip  = clipElement;
        this.player = new YT.Player(clipElement, {
            videoId: youtubeID,
            origin: 'luizalian.com.br',
            events: {
                'onReady': this.ready,
            },
            playerVars: {rel: 0},
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