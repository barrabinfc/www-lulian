/**
 * Youtube Player with events
 */
export default class ClipPlayer {
    constructor( clipElement, youtubeID , origin='luizalizan.com.br'){
        this.playing = false;
        this.clip  = clipElement;
        this.player = new YT.Player(clipElement, {
            videoId: youtubeID,
            events: {
                'onReady': this.ready,
            },
            playerVars: {
                origin: origin,
                controls: 2,
                rel: 0,
                showinfo: 0,
                playsinline: 1,
                modestbranding: 0,
                iv_load_policy: 3,
                showinfo: 0
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