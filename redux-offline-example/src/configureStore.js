import {applyMiddleware, combineReducers, createStore} from "redux";
import users from "./reducers/usersReducer"
import {composeWithDevTools} from "redux-devtools-extension";
import {logger} from "redux-logger";

export const store = createStore(
  combineReducers({users}),
  composeWithDevTools(applyMiddleware(logger))
);
