import Api from '../../api'
export const LOGIN = 'LOGIN';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGIN_OUT = 'LOGIN_OUT';
const userLogin = (data) => {
    return {
        type: LOGIN, 
        data:data
    }
}
export const loginFail = () => {
    return {
        type: LOGIN_FAIL, 
    }
}
export const loginOut = () => {
    return {
        type: LOGIN_OUT,
    }
}
export const login = (data)=>{
    return (dispath, getState)=>{
        Api.login(data).then(res=>{
            dispath(userLogin(res))
        })
    }
}
