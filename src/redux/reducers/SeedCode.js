import { createSlice } from "@reduxjs/toolkit"

export const seedCode = createSlice({
    name: 'seedCode',
    initialState: {
        code: "",
        sampleInterval: 0,
        samplePercentage: 0
    },
    reducers: {
        setSeedCode: (state, action) => {
            state.code = action.payload[0]
            state.sampleInterval = action.payload[1]
            state.samplePercentage = action.payload[2]

        },
        resetSeedCode: (state) => {
            state.code = ""
            state.sampleInterval = ""
            state.samplePercentage = ""
        }
    }
})
export const { setSeedCode, resetSeedCode } = seedCode.actions
export default seedCode.reducer