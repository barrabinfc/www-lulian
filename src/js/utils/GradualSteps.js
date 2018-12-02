/**
 * Gradual steps abstraction
 *  Has enter() and exit() fns for each step.
 * 
 */
const success = () => {
    return Promise.resolve();
}

export default class GradualSteps {
    /**
     * Usage:
     * let stages = new GradualSteps('BLANK')
     * stages.addStep('STEP_TWO').enter( enter2Fn ).exit( exit2Fn )
     * stages.addStep('STEP_THREE).enter( enter2Fn ).exit( exit2Fn )
     * 
     * stages.to(STEP_TWO).then( () => {
     *  stages.to(STEP_THREE).then( () => {
     *      console.log("ALL STEPS COMPLETE")
     *  });
     * })
     */
    constructor( defaultStep='UNITIALIZED', enterFn=success, exitFn=success) {
        this.step     = defaultStep
        this.steps    = [defaultStep];
        this.enterFns = [enterFn]; 
        this.exitFns  = [enterFn];
    }

    /**
     * Change current step to next step.
     * Will gradually move, calling exit of current step,
     * then giving the step forward, and calling enter of the new! step.
     * 
     * @param {String} nextStep 
     */
    to( nextStep ) {
        return new Promise( (resolve, reject) => {
            let nextStepIdx = this.steps.indexOf( nextStep ); 
            let currStepIdx = this.steps.indexOf( this.step ); 
            let previousStep = undefined; 

            // First call exit handlers
            let exitFn = this.exitFns[currStepIdx] || success;
            let enterFn = this.enterFns[nextStepIdx] || success;

            exitFn(this.step, this.nextStep)
                // Stop if exit had problems
                .catch( reject )                
                
                // update current step, if resolved
                .then( () => { 
                    console.info('Step:', `${this.step} -> ${nextStep}`)
                    this.previousStep = this.steps[currStepIdx];
                    this.step = nextStep;
                    return Promise.resolve();
                })
                // And call intro handlers
                .then( () => {
                    enterFn(this.previousStep, nextStep);
                })

                // Finally pass control back to where it came to('newStep').then() 
                .catch( reject )
                .then( resolve );
        });
    }

    /**
     * Add a new step.
     *  Return a object to customize step .enter() or exit()
     * 
     * Use promises on the callbacks, to allow precise and reproducible
     *     gradual steps.
     */
    addStep( stepName ) {
        let stepIdx = this.steps.length;

        this.steps.push(stepName);
        this.enterFns.push( success );
        this.exitFns.push( success );

        let _closure = {
            enter: ( fn=success ) => { this.enterFns[stepIdx] = fn; return _closure;  },
            exit:  ( fn=success ) => { this.exitFns[stepIdx] = fn;  return _closure; }
        };

        return _closure;
    }

}