import {ActionType} from "../actions"
import { GiftedChat } from 'react-native-gifted-chat';


const initialStates = {
    data:[],
    messages: [],
    step:0,
}


export default (state = initialStates,action) => {
    switch(action.type){
        case ActionType.RESET_VIEW: return initialStates;

        case ActionType.ADD_VALUE: return {...state,value:state.value+1};
        case ActionType.PULL_DATA: return {...state,messages:GiftedChat.append(state.messages,action.payload),step:state.step+1};
        case ActionType.PUSH_MESSAGE: return {...state,messages:action.payload};
        case ActionType.STEP: return {...state,step:state.step+1};

        default: return state;
    }
}