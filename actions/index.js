export const ActionType = {
    ADD_VALUE:"addValue",
    
    PUSH_DATA:"pushSkeduleData",
    DEL_DATA:"deleteSleduleData",
    POP_DATA:"popSkeduleData",
    FIN_DATA:"archiveSkeduleData",
    PUSH_SCHEDULE:"pushSchedule",
    RESET_SCHEDULE:"resetSchedule",
    
    PUSH_TEXT:"pushComandText",
    
    PULL_DATA:"pullData",
    PUSH_MESSAGE:"pushMessage",
    STEP:"advanceStep",
    STEP2:"advanceStep2",
    RESET_VIEW:"resetView",
    RESET_MAIN:"resetMain",
}

export const pushText = (text) => ({type:ActionType.PUSH_TEXT,payload:text});
export const pushMessage = (messages) => ({type:ActionType.PUSH_MESSAGE,payload:messages})
export const steps = () => ({type:ActionType.STEP});
export const finData = (id) => ({type:ActionType.FIN_DATA,payload:id});