import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reducers } from '../reducers';

const store = createStore(reducers,applyMiddleware(thunkMiddleware));

//获取当前值
// let currentValue = store.getState();
// //创建一个监听
// store.subscribe(() => {
//     const previosValue = currentValue;
//     currentValue = store.getState();
//     console.log('上一个值:', previosValue, '当前值:', currentValue)
// });

export default store;