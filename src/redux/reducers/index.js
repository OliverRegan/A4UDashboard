import ThemeReducer from "./ThemeReducer"
import SaveSample from "./SaveSample"
import SeedCode from "./SeedCode"
import { combineReducers } from "redux"


const rootReducer = combineReducers({ ThemeReducer, SaveSample, SeedCode })


export default rootReducer;