import { createSlice } from "@reduxjs/toolkit"
const defaultAudit = {
    importData: {
        file: {
            fileName: "",
            fileSize: ""
        },
        xero: {
            connection: {}
        }
    },
    connectionType: "",
    accounts: [],
    auditDetails: {
        auditor: {
            name: ''
        },
        auditName: "",
        clientName: "",
        financialYear: "",
        accounts: {
            population: '',
            selectedAccounts: [],
            transactionNum: '',
            creditAmount: '',
            debitAmount: ''
        },
        sampling: {
            sampledTransactions: [],
            useSeed: false,
            credit: '',
            debit: '',
            materiality: '',
            seedInput: '',
            seed: '',
            sampleInterval: '',
            samplePercentage: '',
            creditSampled: 0,
            debitSampled: 0,
        },
        search: {
            searchedTransactions: [],
            type: {
                debit: false,
                credit: false
            },
            minAmount: '',
            maxAmount: '',
            startDateString: '',
            endDateString: '',
            startDate: null,
            endDate: null,
            description: ''
        },
        recurring: {
            recurringTransactions: [],
            identifierTransactions: [],
            type: {
                debit: false,
                credit: false
            },
            recurrence: {
                daily: false,
                weekly: false,
                monthly: false,
                quarterly: false,
                biYearly: false,
                yearly: false
            },
            minAmount: '',
            maxAmount: '',
            startDateString: '',
            endDateString: '',
            startDate: null,
            endDate: null,
            description: '',
            useExact: false,
            exactAmount: '',
            percentage: ''
        }
    }
}
export const saveAudit = createSlice({
    name: 'saveAudit',
    initialState: defaultAudit,
    reducers: {
        setAudit: (state, action) => {
            state.importData = action.payload[0]
            state.connectionType = action.payload[1]
            state.accounts = action.payload[2]
            state.auditDetails = action.payload[3]
        },
        resetAudit: (state) => {
            state.importData = defaultAudit.importData
            state.connectionType = defaultAudit.connectionType
            state.accounts = defaultAudit.accounts
            state.auditDetails = defaultAudit.auditDetails
        }
    }
})
export const { setAudit, resetAudit } = saveAudit.actions
export default saveAudit.reducer