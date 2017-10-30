import * as submit from '../actions/TableOperation';
export const submits = (state={submits: false}, action)=>{
    switch (action.type) {
        case submit.SUBMIT:
            return Object.assign({}, state,{submits: true});
        case submit.CANCEL:
            return Object.assign({}, state,{submits: false});
        default:
            return {
                ...state
            }
    }
}