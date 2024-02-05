const columns = [
    {
        field: 'accountNum',
        headerName: 'Account Number',
        flex: 1,
        valueGetter: (params) => {
            if (params.value === "0") {
                return "No Account Number";
            } else {
                return params.value
            }
        },
    },
    { field: 'name', headerName: 'Account Name', flex: 1 },
    {
        field: 'totalCredit',
        headerName: 'Total Credit',
        type: 'number',
        sortable: true,
        flex: 1,
        valueGetter: (params) => {
            // Convert the decimal value to a percentage
            return params.value;
        },
        valueFormatter: (params) => {
            if (!params.value) {
                return params.value;
            }
            // Convert the decimal value to a percentage
            return '$' + parseFloat(params.value).toLocaleString(2);
        },
    },
    {
        field: 'totalDebit',
        headerName: 'Total Debit',
        type: 'number',
        flex: 1,
        valueGetter: (params) => {
            // Convert the decimal value to a percentage
            return params.value;
        },
        valueFormatter: (params) => {
            if (!params.value) {
                return params.value;
            }
            // Convert the decimal value to a percentage
            return '$' + parseFloat(params.value).toLocaleString(2);
        },
    },
];

export default columns