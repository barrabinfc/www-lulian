/**
 * Algorithm to make  dynamic header, in other words,
 * it can collapse to occupy less space, hide completely and
 * respond to user touch to display 'smartly'. It's also mobile
 * friendly(hamburguer) with gestures support.
 * 
 * .micro => Small menu
 * .offscreen => Out of screen (top)
 * default => Visible at XX pixels
 * 
 * mobile:
 *  hidden -> visible
 * 
 * Gestures:
 *  Scroll to top: From (.micro|offscreen) to default
 * 
 * input -> For mobile use, checked means expand nav+header
 * nav.menu -> <li>Links</li> to each page 
 * header.header -> Contains logo and hamburguer menu 
 */
import GradualSteps from './GradualSteps';

/** Globals from utils
 * import {listen} from '../utils/utils.js'
 */
const listen = window.listen
const isMobile = window.isMobile()

/* Only one nav.menu per page */
const HEADER_STATES = {'VISIBLE': 'VISIBLE', 
                        'MICRO': 'MICRO', 
                        'OFFSCREEN': 'OFFSCREEN'}

const MOBILE_STATES = {'HIDDEN': 'HIDDEN',
                       'VISIBLE': 'VISIBLE'}

const MODES = {'HORIZONTAL': 'HORIZONTAL', 
                'VERTICAL': 'VERTICAL'}

class FoldableHeader {
    constructor( inputEl, headerEl , mode=(isMobile ? MODES.VERTICAL : MODES.HORIZONTAL)) {
        this.inputEl = inputEl
        this.headerEl = headerEl
        this.navEl = headerEl.querySelector('nav.menu')
        this.shadowEl = headerEl.querySelector('.shadow')

        this.listeners = {
            'header_over': new listen( this.headerEl ),
            'header_out': new listen( this.headerEl ),

            'mob_input': new listen( this.inputEl ), 
            'shadow': new listen( this.shadowEl )
        }

        // Default mode
        this.mode = mode
        console.log("CUrrent mode is ", this.mode)

        this.setupTransitions()
        this.setupListeners()

        console.log(this.mob_state.step)
    }

    /**
     * Change mode to horizontal/vertical
     */
    changeMode( newMode ){
        if(MODES[newMode] === undefined) return undefined;

        this.mode = newMode
    }

    /**
     * Change Step 
     */
    to( nextState ) {
        let state_machine = (this.mode == MODES['HORIZONTAL'] ? this.state
                                                              : this.mob_state )
        return state_machine.to( nextState )
    }

    /**
     * Get active step
     */
    get step(){
        let state_machine = (this.mode == MODES['HORIZONTAL'] ? this.state
                                                              : this.mob_state )
        return state_machine.step;        
    }

    setupListeners(){
        this.listeners['mob_input'].when('change').do( (el) => {
            const tgt = el.target;
            let isMenuOpen = tgt['checked']
            console.log("mob_input changed", isMenuOpen)
            
            if(isMenuOpen)
                this.to(MOBILE_STATES.VISIBLE)
            else
                this.to(MOBILE_STATES.HIDDEN)            
        })
        // When clicked over shadow, same thing as clicked on input
        this.listeners['shadow'].when('pointerup').do( (el) => {
            this.inputEl.dispatchEvent( new MouseEvent('click') );
        })
    }

    setupTransitions(){

        /** Vertical Header */
        this.state = new GradualSteps( HEADER_STATES.VISIBLE , this[HEADER_STATES.VISIBLE + ":enter"].bind(this) )
        this.state.addStep( HEADER_STATES.MICRO )
            .enter( this[HEADER_STATES.MICRO + ':enter'].bind(this)  )
            .exit( this[HEADER_STATES.MICRO + ':exit'].bind(this) );

        this.state.addStep( HEADER_STATES.OFFSCREEN )
            .enter( this[HEADER_STATES.OFFSCREEN + ':enter'].bind(this)  )
            .exit( this[HEADER_STATES.OFFSCREEN + ':exit'].bind(this) )

        /** Horizontal Header */
        this.mob_state = new GradualSteps( MOBILE_STATES.HIDDEN ,
                                            )
        this.mob_state.addStep( MOBILE_STATES.VISIBLE )
                      .enter( this[MOBILE_STATES.VISIBLE + ':enter'].bind(this) )
                      .exit( this[MOBILE_STATES.VISIBLE + ':exit'].bind(this) )
    }

    /**
     * Vertical Header changes
     */
    [HEADER_STATES.VISIBLE + ":enter"](curr,next) {
        console.log("visible:enter")
        return new Promise( (resolve, reject) => {
            console.log("visible:enter-promise")

            this.listeners['header_out'].when( 'pointerleave' ).do( () => {
                console.log("pointerleave")
                this.to( HEADER_STATES.MICRO );
            });

            resolve()
        })
    }
    [HEADER_STATES.VISIBLE + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            console.log('visible:leave')
            this.listeners['header_out'].mute( 'pointerleave' );
            resolve()
        })
    }


    [HEADER_STATES.MICRO + ":enter"](curr,next) {
        return new Promise( (resolve, reject) => {
            console.log("micro:enter")
            this.headerEl.classList.add('micro')
            
            this.listeners['header_over'].when('pointerenter').do( () => {
                this.to( HEADER_STATES.VISIBLE );
            });
            resolve()
        })
    }
    
    [HEADER_STATES.MICRO + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            console.log('micro:exit')
            this.navEl.classList.remove('micro')
            this.listeners['header_over'].mute('pointerenter');
            resolve()
        })
    }

    [HEADER_STATES.OFFSCREEN + ":enter"](curr,next) {
        return new Promise( (resolve, reject) => {
            console.log("offscreen:enter")
            this.headerEl.classList.add('offscreen')
            resolve()
        })
    }

    [HEADER_STATES.OFFSCREEN + ":exit"](curr,next) {
        return new Promise( (resolve, reject) => {
            this.headerEl.classList.remove('offscreen')
            resolve()
        })
    }

    /**
     *  Mobile menu states
     */
    [MOBILE_STATES.VISIBLE + ':enter'](curr,next) {
        return new Promise( (resolve,reject) => {
            this.shadowEl.style = "pointer-events: all;"
            resolve();
        })
    }

    [MOBILE_STATES.HIDDEN + ':enter'](curr,next) {
        return new Promise( (resolve,reject) => {
            this.shadowEl.style = "pointer-events: none;"
            resolve();
        })
    }

}

module.exports = {
    HEADER_STATES,
    FoldableHeader
};

export default FoldableHeader;