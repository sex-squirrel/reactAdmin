import * as loadingType from '../actions/loadings';

export const loadings = (state={loding:false}, action)=>{
    switch (action.type) {
        case loadingType.SHOW_LOADING:
            return Object.assign({}, state, {
                loding: true
            })
        case loadingType.HIDE_LOADING:
           return Object.assign({}, state, {
                loding: false,
            })
        default:
            return {
                ...state
            }
    }
}