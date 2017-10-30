import * as loginAction from '../actions/login';
export const userLogin = (state={}, action)=>{
    switch (action.type) {
        case loginAction.LOGIN:
            return Object.assign({}, state,{...action.data});
        case loginAction.LOGIN_FAIL:
            return {}
        case loginAction.LOGIN_OUT:
            return {}
        default:
            return {
                ...state
            }
    }
}