import * as userListType from '../actions/userList';
import { userListOperation } from '../../api/dataOperation'
export const getUserLists = (state={list: []}, action)=>{
    switch (action.type) {
        case userListType.GET_USER_LIST:
            if (action.data.data && action.data.data.data){
                return Object.assign({}, state, {
                    list: userListOperation(action.data.data.data),
                    per_page: action.data.data.per_page,
                    total: action.data.data.total,
                    from: action.data.data.from,
                    last_page: action.data.data.last_page,
                    current_page: action.data.data.current_page
                })
            }else{
                return Object.assign({}, state, {
                    list: [],
                    per_page: 0,
                    total: 0,
                    from: 0,
                    last_page: 0
                })
            }
        default:
            return {
                ...state
            }
    }
}