import {combineReducers} from 'redux';
import { userLogin } from './login';
import { loadings } from './loading';
import { submits } from './submit';
import { getUserLists } from "./userList";

export const reducers = combineReducers({
	userLogin,
	loadings,
	submits,
    getUserLists
});