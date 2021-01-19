import { combineReducers} from 'redux'; //combineReducers
import user from './user_reducer';


const rootReducer = combineReducers({
    user
})

export default rootReducer;