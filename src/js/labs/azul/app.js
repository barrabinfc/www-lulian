"use strict";

import ClipPlayer from './ClipPlayer';
import GradualSteps from './GradualSteps';
import { CSSVariables , listen , Cronometer, spy  } from './utils';

const AzulStages = {
    'BLANK': 'BLANK',
    'INTRO': 'INTRO',
    'CLIP': 'CLIP',
    'CREDITS': 'CREDITS'
}

let cronometer = new Cronometer();
cronometer.tap('SCRIPT_PARSING');

/* Azul */
class Azul {
    constructor(document = window.document) {
        this.ctx = document;
        this.$vars = CSSVariables(this.ctx.body, getComputedStyle(this.ctx.documentElement));

        this.dom = {
            'style': this.ctx.body.style,
            'logo': this.ctx.querySelector('a.logo'),
            'poster': this.ctx.getElementById('poster'),
            'poster_video': this.ctx.querySelector('#poster > video'),
            'screen': this.ctx.getElementById('screen'),
            'clip': this.ctx.querySelector('#screen > #videoclip'),
            'footer': this.ctx.querySelector('#footer'),
        }
        this.listeners = {};

        this.stages = new GradualSteps(AzulStages.BLANK);
        
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

        cronometer.tap('APP_READY');
    }

    loadClip( videoURL ) {
        cronometer.tap('YOUTUBE_READY');

        let youtubeID = ''
        try { 
            youtubeID = videoURL.match(/\?v=(.*)/)[1]
            console.log("Loading youtube: ", youtubeID)
        } catch (e) {
            throw new Error("Invalid youtube video...", videoURL)
        }

        this.player = new ClipPlayer(this.dom.clip, youtubeID);
        this.player.play  = spy( [this.player.play, this.player],   cronometer.tap.bind(cronometer,'PLAYER_PLAY'));
        this.player.pause = spy( [this.player.pause, this.player],  cronometer.tap.bind(cronometer,'PLAYER_PAUSE'));
        this.player.ready = (ev) => {
            console.log("videoclip ready...")
            cronometer.tap('VIDEOCLIP_READY');
            this.player.play();
        }

        this.listeners['clip'] = new listen(this.dom.clip);
        this.listeners['clip'].when('loadstart').do(this.clip_loadstart.bind(this));
        this.listeners['clip'].when('loadedmetadata').do(this.clip_loadedmtdt.bind(this));
        this.listeners['clip'].when('loadeddata').do(this.clip_loaded.bind(this));
    }

    setupStepTransitions() {
        this.stages.addStep(AzulStages.INTRO)
            .enter( this[AzulStages.INTRO + ':enter'].bind(this)  )
            .exit( this[AzulStages.INTRO + ':exit'].bind(this)  )

        // When entering Clip
        this.stages.addStep(AzulStages.CLIP)
            .enter( this[AzulStages.CLIP + ':enter'].bind(this) )
            .exit( this[AzulStages.CLIP + ':exit'].bind(this) )
    }

    /******************
     *  Transitions 
     *****************/

    /*
     * Transition INTRO:enter
     * FocusIn & set logo interactive after some delay, add click listener
     */
    [AzulStages.INTRO + ":enter"](curr,next) {
        return new Promise((resolve, reject) => {
            this.dom.poster.style['animation-play-state'] = 'running';
            //document.body.style['overflow-y'] = 'hidden';
            setTimeout(() => {
                this.dom.logo.classList.add('interactive');
                this.listeners['logo'].when('click').do(this.poster_click.bind(this));

                cronometer.tap('CHANGE_STAGE', AzulStages.INTRO);

                resolve();
            }, this.$vars['--intro-time']);
        })
    }
    /*
     * Transition INTRO:exit
     * apply focusOut animation, clean click listener
     */
    [AzulStages.INTRO + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            this.dom.footer.style['animation-name'] = 'slideBottom';
            this.dom.poster.style['animation-name'] = 'focusOut';
            this.listeners['logo'].mute('click');

            setTimeout(resolve, this.$vars['--intro-time']);
        })
    }

    /**
     * Clip
     */
    [AzulStages.CLIP + ":enter"](curr,next) {
        return new Promise((resolve, reject) => {
            document.body.style['overflow-y'] = 'auto';

            this.dom.footer.classList.add('collapsed');
            this.dom.poster.classList.add('hidden');
            this.dom.screen.classList.remove('hidden');
            this.dom.screen.classList.add('visible');

            this.listeners['screen'].when('click').do(this.screen_click.bind(this));
            cronometer.tap('CHANGE_STAGE', AzulStages.CLIP);

            this.player.play();
            resolve();
        })
    }

    [AzulStages.CLIP + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            this.player.pause();
        })
    }

    /******
     * Handlers
     *****/
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
        this.stages.to(AzulStages.INTRO).then(() => { console.info("*** BG PRELOADED ***") })
    }

    poster_click( ev ) { 
        ev.preventDefault();
        ev.stopPropagation();
        this.stages.to(AzulStages.CLIP)
    }

    screen_click( ev ) { 
        this.player.toggle(); 
    }
}


/* Intro animation 
function intro_setReady(){ logo.classList.add('ready'); }
function intro(){
    poster.style['animation-play-state'] = 'running';
    setTimeout( intro_setReady, getCSSVar('--intro-time'));
}

/* Out Animation 
function clip_setReady(){  
    screen.classList.remove('hidden')
    screen.classList.add('visible'); 
    player.play();
}
function intro_finish(){
    poster.style['animation-name'] = 'focusOut';
}

logo.addEventListener('pointerup', (ev) => {
    ev.preventDefault();

    requestAnimationFrame( intro_finish );
    setTimeout( clip_setReady, getCSSVar('--intro-time'));

    return false;
})

document.addEventListener('posterPreloaded', () => {
    setTimeout( intro, getCSSVar('--intro-delay'));
});

*/

module.exports = {
    CSSVariables,
    Azul,
    AzulStages,
    cronometer
};

export default Azul;