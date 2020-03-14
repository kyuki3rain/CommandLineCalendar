import {take,put,select,takeEvery,call} from "redux-saga/effects";
import {ActionType} from "../actions";
import { Notifications } from 'expo';

export function* parseRoot(){
    yield call(resetNotif);
    const data = yield select(state => state.main.data);
    for(let i=0;i<data.length;i++){
        yield call(scheduleNotification,data[i]);
    }
    yield takeEvery(ActionType.PUSH_TEXT,parse);
}

async function resetNotif(){
    await Notifications.cancelAllScheduledNotificationsAsync();
}

function* parse(action){
    const text = action.payload;
    const cmd = text.split(/\s|\n/);
    const step = yield select(state => state.view.step);
    const skedule = [];
    let data = [];
    // console.log(cmd);
    try{
        switch(cmd[0]){
            case "add":
                switch(cmd[1]){
                    case "list":
                        let i=2;
                        while(cmd[i]!=="end"){
                            data.push(parseSkedule(cmd.slice(i,i+5)));
                            yield call(scheduleNotification,parseSkedule(cmd.slice(i,i+5)));
                            // yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:id,data:parseSkedule(cmd.slice(i,i+5))}})
                            i+=5;
                        }
                        break;
                        
                    default:
                        data.push(parseSkedule(cmd.slice(1,6)));
                        yield call(scheduleNotification,parseSkedule(cmd.slice(1,6)));
                        // yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:id,data:parseSkedule(cmd.slice(i,i+5))}})
                        break;
                }
                yield put({type:ActionType.PUSH_DATA,payload:data});
                yield put({type:ActionType.PULL_DATA,payload:message("it is registered!",step)});
                break;
            
            case "pull":
                const datas = yield select(state => state.main.data);
                const dataTexts = datas.map(data => returnText(data));
                
                switch(cmd[1]){
                    case "all":
                        yield put({type:ActionType.PULL_DATA,payload:message(dataTexts.join("\n"),step)});
                        console.log(dataTexts.join("\n"));
                        break;
                    
                    case "latest":
                        const dataText = dataTexts[dataTexts.length-1];
                        yield put({type:ActionType.PULL_DATA,payload:message(dataText,step)});
                        console.log(dataText);
                        break;
                    
                    case "archive":
                        const archives = yield select(state => state.main.archive);
                        const archiveTexts = archives.map(archive => returnText(archive));
                        yield put({type:ActionType.PULL_DATA,payload:message(archiveTexts.join("\n"),step)});
                        break;

                    default:throw "pull is error";
                }
                break;
    
            case "delete":
                switch(cmd[1]){
                    case "all":
                        yield put({type:ActionType.DEL_DATA})
                        yield call(resetNotif);
                        break;
                    case "latest":
                        yield put({type:ActionType.POP_DATA})
                        break;

                    default:throw "delete is error";
                }
                break;
            
            case "reset":
                switch(cmd[1]){
                    case "main":
                        yield put({type:ActionType.RESET_MAIN});
                        yield call(resetNotif);
                        break;

                    case "view":
                        yield put({type:ActionType.RESET_VIEW});
                        break;

                    case "all":
                        yield put({type:ActionType.RESET_MAIN});
                        yield call(resetNotif);
                        yield put({type:ActionType.RESET_VIEW});
                        break;

                    default:throw "reset is error";
                }
                break;

            default:
                switch(cmd[0]){
                    case "list":
                        let i=1;
                        while(cmd[i]!=="end"){
                            data.push(parseSkedule(cmd.slice(i,i+5)));
                            yield call(scheduleNotification,parseSkedule(cmd.slice(i,i+5)));
                            // yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:id,data:parseSkedule(cmd.slice(i,i+5))}})
                            i+=5;
                        }
                        break;
                        
                    default:
                        data.push(parseSkedule(cmd.slice(0,5)));
                        yield call(scheduleNotification,parseSkedule(cmd.slice(0,5)));
                        // yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:id,data:parseSkedule(cmd.slice(i,i+5))}})
                        break;
                }
                yield put({type:ActionType.PUSH_DATA,payload:data});
                yield put({type:ActionType.PULL_DATA,payload:message("it is registered!",step)});
                break;
        }
    }catch(err){
        console.log(err);
        yield put({type:ActionType.PULL_DATA,payload:message("Error:input text is a wrong format!",step)});
    }
    
}


const message = (text,step) => {
    return {
        _id: step,
        text: text,
        createdAt: new Date(),
        user: {
            _id: 2,
            name: 'LINE Calendar',
            avatar: 'https://placeimg.com/140/140/any',
        }
    };
}

const parseSkedule = (skedule) => {
    let date = new Date();
    let res={
        date:{
            year:date.getFullYear(),
            month:date.getMonth()+1,
            day:date.getDate(),
            hour:"allDay",
            minute:0,
        },
        plan:{
            title:"",
            content:"",
        },
        tag:[],
    };

    const s = skedule[0].split('/');
    s.map(s=>{if(isNaN(s)){throw "date 1 is not a number";}})
    let planDate;

    const t = skedule[1].split(':');
    t.map(t=>{if(isNaN(t)){throw "date 1 is not a number";}})
    switch(t.length){
        case 2:
            res.date.hour = parseInt(t[0],10);
            res.date.minute = parseInt(t[1],10);
            break;
            
        case 1:
            res.date.hour = parseInt(t[0],10);
            break;

        default: throw "date 2 is error";
    }

    let dateNum;

    switch(s.length){
        case 3:
            res.date.year = parseInt(s[0],10);
            res.date.month = parseInt(s[1],10);
            res.date.day = parseInt(s[2],10);
            break;
        
        case 2:
            
            res.date.month = parseInt(s[0],10);
            res.date.day = parseInt(s[1],10);
            dateNum = new Date(res.date.year,res.date.month,res.date.day,res.date.hour,res.date.minute);
            if(dateNum.getTime()<date.getTime())res.date.year=res.date.year+1;
            break;

        case 1:
            res.date.day = parseInt(s[0],10);
            dateNum = new Date(res.date.year,res.date.month,res.date.day,res.date.hour,res.date.minute);
            if(dateNum.getTime()<date.getTime()){
                if(res.date.month<12)res.date.month=res.date.month+1;
                else{
                    res.date.month=1;
                    res.date.year=res.date.year+1;
                }
            }
            break;

        default:throw "date 1 is error";
    }

    if(skedule[2])res.plan.title=(skedule[2]!=="-")?skedule[2]:"";
    if(skedule[3])res.plan.content=(skedule[3]!=="-")?skedule[3]:"";
    if(skedule[4])res.tag = (skedule[4]!=="-")?skedule[4].split("/,|、/"):"";

    return res;
}

function* scheduleNotification(data){
    const date = new Date(data.date.year,data.date.month-1,data.date.day,data.date.hour,data.date.minute);
    const moning = new Date(data.date.year,data.date.month,data.date.day,7,0);
    console.log(date);
    if(moning.getTime>new Date().getTime()){
        let notificationId_moning = yield call(notificationAdd,"今日は"+data.plan.title+"があります。",data.plan.content,moning.getTime());
        yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:notificationId_moning,data}});
        console.log(notificationId_moning);
    }
    if(date.getTime()-1800000>new Date().getTime()){
        let notificationId_before = yield call(notificationAdd,data.plan.title+"の30分前です。",data.plan.content,date.getTime() - 1800000);
        yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:notificationId_before,data}});
        console.log(notificationId_before);
    }
    if(date.getTime()>new Date().getTime()){
        let notificationId = yield call(notificationAdd,data.plan.title,data.plan.content,date.getTime());
        yield put({type:ActionType.PUSH_SCHEDULE,payload:{id:notificationId,data}});
        console.log(notificationId);
    }
  };

  async function notificationAdd(title,body,time){
      console.log("add notification ", title , body , time);
    let notificationId = await Notifications.scheduleLocalNotificationAsync(
        {
          title,
          body,
          actionId:"schedule",
          ios:{
            sound:true
          },
          android:{
                channelId:'schedule',
                sound:true,
                vibrate:true,
          }
        },
        {
          time,
        },
      );
      return notificationId;
  }

  function returnText(data){
    return data.date.year + "/" + data.date.month + "/" + data.date.day + " " + ('00'+data.date.hour).slice(-2) + ":" + ('00'+data.date.minute).slice(-2) + " " + data.plan.title + " " + data.plan.content;
  }