import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import { applyMiddleware,createStore, compose } from "redux";
import createSagaMiddleware from 'redux-saga';
import {persistReducer,persistStore} from "redux-persist";
import { AsyncStorage } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import sagas from "./sagas";
import reducer from "./reducer";

const sagaMiddleware = createSagaMiddleware();
const persistConfig = {key: 'root',storage:AsyncStorage,}
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer ,compose(applyMiddleware(sagaMiddleware),process.env.NODE_ENV === 'development' && window.devToolsExtension ? window.devToolsExtension() : f => f));
sagaMiddleware.run(sagas);
let persistor = persistStore(store);

import Main from "./main";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <Main></Main>
        </PersistGate>
    </Provider>
  );
}