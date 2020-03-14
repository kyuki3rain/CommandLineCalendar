import { all,fork } from "redux-saga/effects";
import {parseRoot} from "./parse";

export default function* rootSaga(){
    yield fork(parseRoot);
}