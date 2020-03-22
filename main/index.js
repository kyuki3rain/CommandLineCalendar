import React from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { Dimensions,View,Platform,KeyboardAvoidingView,Button } from "react-native";
import { pushText,pushMessage,steps,finData } from "../actions"

import {Notifications} from "expo";
import * as Permissions from 'expo-permissions';


const localNotification = {
    title:"a",
    body:"b",
}

class Container extends React.Component {
    state = {
        messages: [],
    }

    registerForPushNotificationsAsync = async () => {

        try {
            //現在のNotificationパーミッション状況取得
            const { status: existingStatus } = await Permissions.getAsync(
                Permissions.NOTIFICATIONS
            );
            let finalStatus = existingStatus;

            //statusが許可じゃなければ（許可済みなら何もしない）
            if (existingStatus !== 'granted') {
                //許可を尋ねる
                const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                finalStatus = status;
            }
            //それでも許可されてなかったら何もしない
            if (finalStatus !== 'granted') {
                return;
            }
        } catch (e) {
        }
    }
    
    componentDidMount() {
        this.registerForPushNotificationsAsync();
        // Notifications.createCategoryAsync("schedule",[{
        //     actionId:"schedule",
        // }])
        Notifications.addListener((notification,catchNotification = (id) => this.catchNotification(id)) => {
            catchNotification(notification.notificationId.toString());
        })
        if (Platform.OS === 'android') {
            Notifications.createChannelAndroidAsync('schedule', {
              name: 'schedule',
              priority: "max",
              sound:true,
              vibrate: true,
            })
          }
    }

    catchNotification(id){
        const data = this.props.schedule[id].data;
        const text = data.date.year + "/" + data.date.month + "/" + data.date.day + " " + ('00'+data.date.hour).slice(-2) + ":" + ('00'+data.date.minute).slice(-2) + " " + data.plan.title + " " + data.plan.content;
        this.reply(text);
        this.props.finData(id);
    }

    reply(text){
        const messages = [{
            _id: this.props.step,
            text: text,
            createdAt: new Date(),
            user: {
                _id: 3,
                name: 'Schedule Notification',
                avatar: 'https://placeimg.com/140/140/any',
            }
        }];
        this.props.steps();
        this.props.pushMessage(GiftedChat.append(this.props.messages, messages));
    }

    onSend(messages = []) {
        this.props.pushMessage(GiftedChat.append(this.props.messages, messages));
        this.props.pushText(messages[0].text);
    }
    render() {
        return (
        <View style={{ flex:1 }}>
            <GiftedChat
                messages={this.props.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1,
                    name: 'you',
                    avater: 'https://placeimg.com/140/140/any'
                }}
            />
            {
                Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
            }
        </View>
        );
    }
}

export default connect(
    state => ({ messages:state.view.messages,schedule:state.main.schedule,step:state.view.step }),
    { pushText,pushMessage,steps,finData }
)(Container);
