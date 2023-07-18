import ThemeReducer from "./ThemeReducer"
import SaveSample from "./SaveSample"
import SeedCode from "./SeedCode"
import SaveAudit from "./SaveAudit"
import { combineReducers } from "redux"


const rootReducer = combineReducers({ ThemeReducer, SaveSample, SeedCode, SaveAudit })


export default rootReducer;