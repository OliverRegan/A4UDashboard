import { createSlice } from "@reduxjs/toolkit"

export const saveAudit = createSlice({
    name: 'saveAudit',
    initialState: {
        file: {
            fileName: "",
            fileSize: "",
        },
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