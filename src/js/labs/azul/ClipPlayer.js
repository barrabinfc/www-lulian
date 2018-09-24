/**
 * Play listeners
 */
export default class ClipPlayer {
    constructor( clipElement, youtubeID ){
        this.playing = false;
        this.clip  = clipElement;
        this.player = new YT.Player(clipElement, {
            videoId: youtubeID,
            events: {
                'onReady': this.ready,
            },
            playerVars: {
                origin: ['localhost:3000','luizalian.com.br'],
                rel: 0,
                playsinline: 0,
                modestbranding: 1,
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