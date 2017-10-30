export const SUBMIT = 'SUBMIT';
export const CANCEL = 'CANCEL';
export const subDispatch = (data) => {
    return {
        type: SUBMIT, 
        data:data
    }
}
export const cancelDispatch = (data) => {
    return {
        type: CANCEL, 
        data:data
    }
}