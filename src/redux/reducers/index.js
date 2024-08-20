import {combineReducers} from 'redux';

const login = (state = {}, action) => {
	switch (action.type) {
		case 'LOGIN':
			return {
				...action.user,
			};
			break;
		default:
			return state;
	}
}


export default combineReducers({
	login
});
