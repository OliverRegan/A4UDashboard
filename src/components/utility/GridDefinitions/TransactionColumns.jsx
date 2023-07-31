const columns = [
    { field: 'accountNum', headerName: 'Type', flex: 1 },
    { field: 'accountName', headerName: 'Account', flex: 1 },
    {
        field: 'externalId',
        headerName: 'External Id',
        type: 'string',
        flex: 1,
    },
    {
        field: 'credit',
        headerName: 'Credit',
        type: 'string',
        flex: 1,
        valueGetter: (params) => {
            if (!params.value) {
                return params.value;
            }
            // Convert the decimal value to a percentage
            return '$' + parseFloat(params.value).toLocaleString(2);
        },
    },
    {
        field: 'debit',
        headerName: 'Debit',
        type: 'string',
        flex: 1,
        valueGetter: (params) => {
            if (!params.value) {
                return params.value;
            }
            // Convert the decimal value to a percentage
            return '$' + parseFloat(params.value).toLocaleString(2);
        },
    },
    {
        field: 'source',
        headerName: 'Source',
        type: 'string',
        flex: 1,
    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'string',
        flex: 1,
    },
    {
        field: 'description',
        headerName: 'Description',
        type: 'string',
        flex: 1,
    },
];

export default columns