import * as utils from './utils'
import {FoldableHeader, HEADER_STATES,
        MODES} from './HeaderFoldable'

export function setupSmartHeaderNavigation( inputCheckEl, headerEl ) {
    return new FoldableHeader( inputCheckEl, headerEl ,  MODES.VERTICAL );
}

let exp = {
    ...utils,
    setupSmartHeaderNavigation
}
console.log("Exporting utils: ", exp);
module.exports = exp;
export default exp;