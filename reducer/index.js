import { combineReducers } from "redux"
import main from "./MainReducer";
import view from "./ViewReducer";
import first from "./first"
import second from "./second"


export default combineReducers({
    main,
    view,
})