import {applyMiddleware, combineReducers, createStore} from "redux";
import todos from "./reducers/todosReducer"
import {composeWithDevTools} from "redux-devtools-extension";
import {logger} from "redux-logger";
import thunk from "redux-thunk"
import { offline } from '@redux-offline/redux-offline';
import defaultConfig from '@redux-offline/redux-offline/lib/config';

export const store = createStore(
  combineReducers({todos}),
  composeWithDevTools(offline(defaultConfig), applyMiddleware(logger, thunk))
);
