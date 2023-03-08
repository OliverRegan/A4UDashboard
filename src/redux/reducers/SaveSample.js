import { createSlice } from "@reduxjs/toolkit"

export const saveSamples = createSlice({
    name: 'saveSamples',
    initialState: {
        debit: 0,
        credit: 0,
        materiality: 0,
        seedCode: 0,
    },
    reducers: {
        set: (state, action) => {
            state.debit = action.payload[0]
            state.credit = action.payload[1]
            state.materiality = action.payload[2]
            state.seedCode = action.payload[3]
        },
        reset: (state) => {
            state.debit = 0
            state.credit = 0
            state.materiality = 0
            state.seedCode = 0
        }
    }
})
export const { set, reset } = saveSamples.actions
export default saveSamples.reducer