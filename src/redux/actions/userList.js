import Api from '../../api'
export const GET_USER_LIST = 'GET_USER_LIST';
const userList = (data) => {
    return {
        type: GET_USER_LIST,
        data:data
    }
}
export const getUserList = (data)=>{
    return (dispath,getState)=>{
        Api.userList(data).then((res)=>{
            dispath(userList(res))
        })
    }
}