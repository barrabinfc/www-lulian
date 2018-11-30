import '../vendor/pep.js'

export function isMobile(){
    return Math.min(window.screen.width, window.screen.height) < 768
}

/**
 * Get CSS Variable. ComputedStyles is necessary.
 *  
 * @param {*} myvar --CSS Variable name 
 * @param {*} computedStyles -- Document ComputedStyles data (window.getComputedStyles)
 */
export function getCSSVar(myvar, computedStyles=undefined){
    console.assert(computedStyles !== undefined, "❌ getCSSVar needs a valid computedStyles.\nTry `getComputedStyles(document.documentElement)`")
    return computedStyles.getPropertyValue(myvar);
}

/**
 * Use CSSVars to round edges of implementation.
 * 
 * let ctx = document.body
 * $vars = new CSSVariables( ctx, getComputedStyle(ctx) )
 * $vars['--yahoo'] = 10;
 * 
 */
export function CSSVariables(el, computedStyles) {    
    return new Proxy({
        computedStyles: computedStyles,
        style:          el.style
    }, {
        get: function(obj, varName) { 
            return obj['computedStyles'].getPropertyValue(varName);
        },
        set: function(obj, varName, varValue) {
            obj['style'].setProperty(varName, varValue)
        }
    })
}

/** Metaprogramming magic */
// first basic compose
export const compose = (A) => (b) => (A(b));

/** Magic trace of method calls */
export function traceMethodCalls(obj, traceFn=console.log) {
    let handler = {
        get(target, propKey, receiver) {
            const origMethod = target[propKey];
            return function (...args) {
                let result = Reflect[propKey](...args); //origMethod.apply(this, args);
                traceFn(propKey, JSON.stringify(args), JSON.stringify(result));
                return result;
            };
        }
    };
    return new Proxy(obj, handler);
}

/** Spy function calls */
export function spy( [subject, _ctx=null], spyFn) {
    return (...args) => {
        spyFn(...args); 
        return subject.apply( _ctx, args);
    }
}

/**
 * Listen/mute a single event on a Element.
 * @param {*} el 
 * 
 * @usage let listener = new listen('a.logo')
 *            listener.when('click').do( (ev) => { console.log("clicked"); })
 *                    .when('touch').do( (ev) => { console.log("touched"); })
 *            setTimeout( () => {
 *                  listener.mute('click').mute('touch');
 *            }, 3000);
 */
export function listen(el){
    this.el = el;
    this.evHandlers = {};

    this['when'] = (evName, evoptions=[]) => {
        return {'do': (resolve) => {
            this.evHandlers[evName] = compose( resolve )
            this.el.addEventListener(evName, this.evHandlers[evName], ...evoptions);
            
            return this;
        }}
    }
    this['mute'] = (evName) => {
        console.log("Muting : ", evName)
        if(this.evHandlers[evName] == undefined) return;
        
        this.el.removeEventListener(evName, this.evHandlers[evName])
        return this;
    }

    return this;
}


/**
 * Cronometer for different events
 */
export class Cronometer {
    constructor( hook=null ){
        this.hook = hook;
        this.t0 = this.now();
        this.samples = []
    }

    now() {
        return ((window.performance && window.performance.now()) || Date.now())
    }

    sample(){
        return Number( ((this.now() - this.t0) / 1000).toFixed(4));
    }

    /** Log a single event time (from t0) */
    tap( eventName , evArgs=null) {
        let sample = [this.sample(), eventName, evArgs ];
        if(this.hook && (typeof this.hook)) {
            try {
                this.hook(sample);
            } catch (e) {
                console.error(e);
            }
        }

        this.samples.push( [this.sample(), eventName, evArgs ] );
    }

    debug(){
        let table = this.samples.map( (sample) => ({'time': sample[0], 'name': sample[1], '...': sample[2]} ));
        console.log("%c ⌛ Timings", "font-size: 2em;")
        console.table(table);
    }
}

/**
 * Parse Query String
 * @param {} querystring 
 */
export function parseQS(querystring) {
    // Has parameters? if none, return early
    let paramsIdx = querystring.indexOf('?');
    if (paramsIdx === -1) return []

    // remove any preceding url and split
    querystring = querystring.substring(paramsIdx + 1).split('&');

    const d = decodeURIComponent;
    let params = {};

    // march and parse
    for (var i = querystring.length - 1; i >= 0; i--) {
        let pair = querystring[i].split('=');
        params[d(pair[0])] = d(pair[1] || '');
    }

    return params
}




module.exports = {
    parseQS,
    Cronometer,
    spy,
    listen,
    CSSVariables,
    getCSSVar,
    isMobile
};

export default Cronometer;