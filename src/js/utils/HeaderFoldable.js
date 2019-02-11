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
import { listen } from './utils'

/* Only one nav.menu per page */
const HEADER_STATES = {
    'VISIBLE': 'VISIBLE',
    'MICRO': 'MICRO',
    'OFFSCREEN': 'OFFSCREEN'
}

const MOBILE_STATES = {
    'MOB_HIDDEN': 'MOB_HIDDEN',
    'MOB_VISIBLE': 'MOB_VISIBLE'
}

const MODES = {
    'HORIZONTAL': 'HORIZONTAL',
    'VERTICAL': 'VERTICAL'
}

class FoldableHeader {
    constructor (inputEl, headerEl, mode = (MODES.HORIZONTAL)) {
        this.inputEl = inputEl
        this.headerEl = headerEl
        this.bodyEl = document.body
        this.navEl = this.headerEl.querySelector('nav.menu')
        this.shadowEl = this.bodyEl.querySelector('.shadow')

        // Default mode
        this.mode = mode

        // Mobile state (true=VIsible or false=Hidden)
        this.isOpen = false;

        this.listeners = {
            'header_over': new listen(this.headerEl),
            'header_out': new listen(this.headerEl),

            'mob_input': new listen(this.inputEl),

            'document': new listen(document)
        }

        this.setupTransitions()
        this.setupListeners()
    }

    /**
     * Change mode to horizontal/vertical
     */
    changeMode(newMode) {
        if (MODES[newMode] === undefined) return undefined;

        this.mode = newMode
    }

    /**
     * Change Step 
     */
    to(nextState) {
        let state_machine = (this.mode == MODES['HORIZONTAL'] ? this.state
            : this.mob_state)
        return state_machine.to(nextState)
    }

    /**
     * Get active step
     */
    get step() {
        let state_machine = (this.mode == MODES['HORIZONTAL'] ? this.state
            : this.mob_state)
        return state_machine.step;
    }

    /**
     * Toggle menu mobile visible
     */
    toggleMobileMenu() {
        this.inputEl.dispatchEvent(new MouseEvent('click'));
    }

    setupListeners() {
        /**
         * Mobile menu icon click
         */
        this.listeners['mob_input'].when('change').do((e) => {
            const tgt = e.target;
            this.isOpen = tgt['checked']

            if (this.isOpen)
                this.to(MOBILE_STATES.MOB_VISIBLE)
            else
                this.to(MOBILE_STATES.MOB_HIDDEN)
        })

    }

    setupTransitions() {
        /** Vertical Header */
        this.state = new GradualSteps(HEADER_STATES.VISIBLE,
            this[HEADER_STATES.VISIBLE + ":enter"].bind(this))
        this.state.addStep(HEADER_STATES.MICRO)
            .enter(this[HEADER_STATES.MICRO + ':enter'].bind(this))
            .exit(this[HEADER_STATES.MICRO + ':exit'].bind(this));

        this.state.addStep(HEADER_STATES.OFFSCREEN)
            .enter(this[HEADER_STATES.OFFSCREEN + ':enter'].bind(this))
            .exit(this[HEADER_STATES.OFFSCREEN + ':exit'].bind(this))

        /** Horizontal Header */
        this.mob_state = new GradualSteps(MOBILE_STATES.MOB_HIDDEN,
            this[MOBILE_STATES.MOB_HIDDEN + ':enter'].bind(this))

        this.mob_state.addStep(MOBILE_STATES.MOB_VISIBLE)
            .enter(this[MOBILE_STATES.MOB_VISIBLE + ':enter'].bind(this))
            .exit(this[MOBILE_STATES.MOB_VISIBLE + ':exit'].bind(this))
    }

    /**
     * Vertical Header changes
     */
    [HEADER_STATES.VISIBLE + ":enter"](curr, next) {
        return new Promise((resolve, reject) => {
            console.log("visible:enter-promise")

            this.listeners['header_out'].when('pointerleave').do(() => {
                this.to(HEADER_STATES.MICRO);
            });

            resolve()
        })
    }
    [HEADER_STATES.VISIBLE + ":exit"](curr, next) {
        return new Promise((resolve, reject) => {
            this.listeners['header_out'].mute('pointerleave');
            resolve()
        })
    }


    [HEADER_STATES.MICRO + ":enter"](curr, next) {
        return new Promise((resolve, reject) => {
            console.log("micro:enter")
            this.headerEl.classList.add('micro')

            this.listeners['header_over'].when('pointerenter').do(() => {
                this.to(HEADER_STATES.VISIBLE);
            });
            resolve()
        })
    }

    [HEADER_STATES.MICRO + ":exit"](curr, next) {
        return new Promise((resolve, reject) => {
            console.log('micro:exit')
            this.navEl.classList.remove('micro')
            this.listeners['header_over'].mute('pointerenter');
            resolve()
        })
    }

    [HEADER_STATES.OFFSCREEN + ":enter"](curr, next) {
        return new Promise((resolve, reject) => {
            this.headerEl.classList.add('offscreen')
            resolve()
        })
    }

    [HEADER_STATES.OFFSCREEN + ":exit"](curr, next) {
        return new Promise((resolve, reject) => {
            this.headerEl.classList.remove('offscreen')
            resolve()
        })
    }

    /**
     *  Mobile menu states
     */
    [MOBILE_STATES.MOB_VISIBLE + ':enter'](curr, next) {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                this.navEl.style = 'transition-timing-function: ease-in;'
                this.bodyEl.style = "max-height: 100vh; overflow: hidden;"

                resolve();
            })

            /* Setup ESC key */
            this.listeners['document'].when('keyup').do((e) => {
                if (e.key == 'Escape') this.toggleMobileMenu()
                return
            });

            /** Detect click outside header.header and toggle menu*/
            this.listeners['document'].when('pointerdown', { capture: true }).do((e) => {
                let navBounds = this.navEl.getBoundingClientRect();
                let mouseX = e.clientX;

                if (mouseX < navBounds.x) {
                    this.toggleMobileMenu();

                    e.preventDefault();
                    e.stopPropagation();

                }

                return false;
            });
        })
    }
    [MOBILE_STATES.MOB_VISIBLE + ':exit'](curr, next) {
        return new Promise((resolve, reject) => {
            this.listeners['document'].mute('keyup')
            this.listeners['document'].mute('pointerdown');

            resolve()
        })
    }

    [MOBILE_STATES.MOB_HIDDEN + ':enter'](curr, next) {
        return new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                this.navEl.style = 'transition-timing-function: ease-out;'
                this.bodyEl.style = "max-height: var(--viewport_height); overflow: hidden;"
                resolve();
            })
        })
    }

}

module.exports = {
    HEADER_STATES,
    MOBILE_STATES,
    MODES,
    FoldableHeader
};

export default FoldableHeader;