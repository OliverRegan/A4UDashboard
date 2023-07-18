import { createSlice } from "@reduxjs/toolkit"

export const saveAudit = createSlice({
    name: 'saveAudit',
    initialState: {
        file: {},
        accounts: [],
        auditDetails: {}
    },
    reducers: {
        setAudit: (state, action) => {
            state.file = action.payload[0]
            state.accounts = action.payload[1]
            state.auditDetails = action.payload[2]
        },
        resetAudit: (state) => {
            state.file = {}
            state.accounts = []
            state.auditDetails = {}
        }
    }
})
export const { setAudit, resetAudit } = saveAudit.actions
export default saveAudit.reducer