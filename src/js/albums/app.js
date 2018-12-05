import ClipPlayer from './ClipPlayer';
import GradualSteps from 'utils/GradualSteps';

/**
* Globals
*/
const cronometer = window.cronometer;
const domain = window.domain;
const spy = window.spy;
const listen = window.listen;
const headerManager = window.headerManager;

/** Locals */
const AlbumStages = {
    'BLANK': 'BLANK',
    'INTRO': 'INTRO',
    'CLIP': 'CLIP',
    'CREDITS': 'CREDITS'
}

/* Album */
class Album {
    /**
     * Azul album page.
     * Has tree stages 
     *  (INTRO->CLIP)
     *  (CREDITS)
     */
    constructor(document = window.document, album_player_embed='NO_PLAYER') {

        this.ctx = document;
        this.$vars = CSSVariables(this.ctx.body, getComputedStyle(this.ctx.documentElement));

        this.state = {
            'album_player_embed': album_player_embed
        }

        this.dom = {
            'style': this.ctx.body.style,
            
            'mobile_input': this.ctx.querySelector('#menu-toggle'),
            'header': this.ctx.querySelector('header.header'),

            'logo': this.ctx.querySelector('.logo'),
            'poster': this.ctx.getElementById('poster'),
            'poster_video': this.ctx.querySelector('#poster > video'),

            'screen': this.ctx.getElementById('screen'),
            'clip': this.ctx.querySelector('#screen > #videoclip'),

            '#info': this.ctx.getElementById('#info'),
            'album_info': this.ctx.querySelector('.album-info'),
            'album_player': this.ctx.querySelector('.album-info .album-player'),

            'footer': this.ctx.querySelector('#footer'),
        }
        this.listeners = {};

        this.stages = new GradualSteps(AlbumStages.BLANK);
        
        this.init();
    }

    init() {
        this.setupStepTransitions();

        this.listeners['page'] = new listen(document);
        this.listeners['page'].when('visibilitychange', false).do(this.visibility_change.bind(this));

        this.listeners['logo'] = new listen(this.dom.logo);
        this.listeners['screen'] = new listen(this.dom.screen);
    

        if(this.dom.poster_video){
            this.listeners['poster'] = new listen(this.dom.poster_video);
            this.listeners['poster'].when('loadeddata').do(this.poster_loaded.bind(this));
        } else {
            this.poster_loaded()
        }

        /**
         * Load album when album is in view
         */
        var intersectionOptions = {
            root: this.dom['#info'],
            rootMargin: '100%',
            treshold: 0.1
        }
        this.listeners['album_info'] = new IntersectionObserver( this.loadEmbedAlbum.bind(this), 
                                                                 intersectionOptions);
        this.listeners['album_info'].observe( this.dom['album_player'] )

        cronometer.tap('APP_READY');
        debugger;
    }

    setClip( videoURL ) {
        this.state['videoURL'] = videoURL
    }

    loadClip() {
        cronometer.tap('YOUTUBE_LOADING');

        let youtubeID = ''
        try { 
            youtubeID = this.state['videoURL'].match(/\?v=(.*)/)[1]
            console.log("Loading youtube: ", youtubeID)
        } catch (e) {
            throw new Error("Invalid youtube video...", this.state['videoURL'])
        }

        this.player = new ClipPlayer(this.dom.clip, youtubeID, domain);
        this.player.play  = spy( [this.player.play, this.player],   cronometer.tap.bind(cronometer,'PLAYER_PLAY'));
        this.player.pause = spy( [this.player.pause, this.player],  cronometer.tap.bind(cronometer,'PLAYER_PAUSE'));
        this.player.onReady = (ev) => {
            cronometer.tap('VIDEOCLIP_READY');
        }

        this.listeners['clip'] = new listen(this.dom.clip);
        this.listeners['clip'].when('loadstart').do(this.clip_loadstart.bind(this));
        this.listeners['clip'].when('loadedmetadata').do(this.clip_loadedmtdt.bind(this));
        this.listeners['clip'].when('loadeddata').do(this.clip_loaded.bind(this));
    }

    setupStepTransitions() {
        this.stages.addStep(AlbumStages.INTRO)
            .enter( this[AlbumStages.INTRO + ':enter'].bind(this)  )
            .exit( this[AlbumStages.INTRO + ':exit'].bind(this)  )

        // When entering Clip
        this.stages.addStep(AlbumStages.CLIP)
            .enter( this[AlbumStages.CLIP + ':enter'].bind(this) )
            .exit( this[AlbumStages.CLIP + ':exit'].bind(this) )
    }

    /******************
     *  Transitions 
     *****************/

    /*
     * Transition INTRO:enter
     * FocusIn & set logo interactive after some delay, add click listener
     */
    [AlbumStages.INTRO + ":enter"](curr,next) {
        return new Promise((resolve, reject) => {
            this.dom.poster.style['animation-play-state'] = 'running';
            
            setTimeout(() => {
                this.dom.logo.classList.add('interactive');
                this.listeners['logo'].when('pointerup', {capture: false}).do(this.poster_click.bind(this));

                cronometer.tap('CHANGE_STAGE', AlbumStages.INTRO);

                resolve();
            }, this.$vars['--intro-time']);

        })
    }
    /*
     * Transition INTRO:exit
     * apply focusOut animation, clean click listener
     */
    [AlbumStages.INTRO + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {

            this.dom.footer.style['animation-play-state'] = 'running';
            this.dom.poster.style['animation-name'] = 'focusOut';

            this.listeners['logo'].mute('pointerup');

            setTimeout(resolve, this.$vars['--intro-time'] + 250);
        })
    }

    /**
     * Clip
     */
    [AlbumStages.CLIP + ":enter"](curr,next) {
        return new Promise((resolve, reject) => {
            // change header to micro state
            if(!window.isMobile())
                headerManager.to( 'MICRO' );

            // hide poster
            this.dom.poster.classList.add('hidden');

            // Give some time to poster fadeout animation appear
            // and show screen
            setTimeout( () => {
                this.dom.footer.classList.add('collapsed');
                this.dom.screen.classList.remove('hidden');
                this.dom.screen.classList.add('visible');

                // Play video, wee!
                this.player.play();
            }, 1000 )

            this.listeners['screen'].when('click').do(this.screen_click.bind(this));
            cronometer.tap('CHANGE_STAGE', AlbumStages.CLIP);

            resolve();
        })
    }

    [AlbumStages.CLIP + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            this.player.pause();
        })
    }

    /******
     * Handlers
     *****/
    loadEmbedAlbum( ) {
        window.requestIdleCallback( () => {
            let album_player_url = this.state['album_player_embed']
            console.log("Album player is in view! Load it please! ", album_player_url)
            this.dom['album_player'].innerHTML = `<iframe scrolling="no" frameborder="no" src="${album_player_url}"></iframe>` 
        })
    }

    visibility_change(ev){
        cronometer.tap('PAGE_VISIBILITY', document.visibilityState);
    }

    clip_loadstart(ev){
        cronometer.tap('CLIP_LOAD');
    }
    clip_loadedmtdt(ev){
        cronometer.tap('CLIP_LOADED_MTDT');        
    }
    clip_loaded( ev ) {
        cronometer.tap('CLIP_LOADED');
    }

    poster_loaded( ev ) {
        cronometer.tap('POSTER_LOADED');
        this.stages.to(AlbumStages.INTRO).then(() => { console.info("*** BG PRELOADED ***") })
    }

    poster_click( ev ) { 
        ev.preventDefault();
        ev.stopPropagation();
        
        this.stages.to(AlbumStages.CLIP)
        return false;
    }

    screen_click( ev ) { 
        this.player.toggle(); 
    }
}


module.exports = {
    Album,
    AlbumStages
};

export default Album;