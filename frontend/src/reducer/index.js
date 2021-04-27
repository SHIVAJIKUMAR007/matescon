import { authReducer } from "./auth";
import { massageReducer } from "./massageReducer";
import { notifyReducer } from "./notify";
import { combineReducers } from "redux";

const allReducer = combineReducers({
  authReducer: authReducer,
  massages: massageReducer,
  notify: notifyReducer,
});

export default allReducer;
