import {ActionType} from "../actions"


const initialStates = {
    value:0,
    data:[],
    text:"",
    schedule:{},
    archive:[],
}


export default (state = initialStates,action) => {
    switch(action.type){
        case ActionType.ADD_VALUE: return {...state,value:state.value+1};
        case ActionType.RESET_MAIN: return initialStates;

        case ActionType.FIN_DATA: return {...state,archive:state.archive.concat(state.data[0]),date:state.data.slice(1,state.data.length)}
        case ActionType.PUSH_DATA: return {...state,data:state.data.concat(action.payload)};
        case ActionType.DEL_DATA: return {...state,data:[]};
        case ActionType.POP_DATA: return {...state,data:state.data.slice(0,state.data.length-1)};
        case ActionType.PUSH_TEXT: return {...state,text:action.payload};
        case ActionType.PUSH_SCHEDULE: console.log(action.payload,"\nis added\n",state.schedule);return {...state,schedule:{...state.schedule,[action.payload.id]:action.payload.data}}

        default: return state;
    }
}