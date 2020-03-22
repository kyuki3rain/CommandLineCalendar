import {ActionType} from "../actions"


const initialStates = {
    value:0,
    data:[],
    schedule:{},
    archive:[],
    datatoid:[],
    garbage:[],
}


export default (state = initialStates,action) => {
    switch(action.type){
        case ActionType.ADD_VALUE: return {...state,value:state.value+1};
        case ActionType.RESET_MAIN: return initialStates;

        case ActionType.FIN_DATA: {
            let s = Object.assign({},state.schedule); 
            delete s[action.payload]; 
            let data=state.data.slice();
            let arc = data.splice(state.schedule[action.payload].order,(state.schedule[action.payload].order!==-1)?1:0);
            return {...state,archive:state.archive.concat(arc),data,schedule:s};
}
        case ActionType.PUSH_DATA: {
            return {...state,data:state.data.concat(action.payload)};
}
        case ActionType.DEL_DATA:{
            let s = Object.assign({},state.schedule); 
            if(Array.isArray(state.datatoid[action.payload.order]))state.datatoid[action.payload].forEach(id => delete s[id]);
            let data = state.data.slice();
            let del = data.splice(action.payload,1);
            return {...state,garbage:state.garbage.concat(del),data,schedule:s};
            }
        // case ActionType.PUSH_TEXT: return {...state,text:action.payload};
        case ActionType.PUSH_SCHEDULE: {
            const datatoid=state.datatoid.slice();
            if(!Array.isArray(datatoid[action.payload.order]))datatoid[action.payload.order]=[];
        return {...state,datatoid:datatoid[action.payload.order].concat(action.payload.id),schedule:{...state.schedule,[action.payload.id]:{data:action.payload.data,order:action.payload.order}}}
        }
        case ActionType.RESET_SCHEDULE: return {...state,schedule:{}};

        default: return state;
    }
}