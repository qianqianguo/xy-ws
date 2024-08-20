//store/index.js
import {applyMiddleware, createStore} from 'redux';
//引入Reducer
import Reducer from './reducers';
//引入中间件
import thunkMiddleware from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const configureStore = (initialState) => {
	return createStoreWithMiddleware(Reducer, initialState);
}
export default configureStore()
