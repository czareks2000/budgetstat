import { Box, Divider, Paper, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes"
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit } from "@mui/icons-material"
import dayjs from "dayjs"
import CategoryIcon from "../../components/common/CategoryIcon"
import { formatAmount } from "../../app/utils/FormatAmount"
import { TransactionType } from "../../app/models/enums/TransactionType"
import { AmountItem, CategoryItem, TransactionRowItem } from "../../app/models/Transaction"

export default observer(function Transactions() {
    
    const handleAddButtonClick = () => {
        router.navigate('/transactions/create');
    }

    const handleEditButtonClick = (transactionId: number) => {
        router.navigate(`/transactions/${transactionId}/edit`);
    }

    const columns: GridColDef<TransactionRowItem[][number]>[] = [
        { 
            field: 'id', 
            headerName: 'ID', 
            width: 70 
        },
        {
            field: 'date',
            headerName: 'Date',
            type: 'date',
            minWidth: 120,
            flex: 1,
            editable: false,
        },
        {
            field: 'account',
            headerName: 'Account',
            minWidth: 120,
            flex: 1,
            editable: false,
            renderCell: (params) => {
                return params.value || <i>(deleted)</i>
            },
            valueFormatter: (value) => `${value || '(deleted)'}`,
        },
        {
            field: 'category',
            headerName: 'Category',
            editable: false,
            renderCell: ({value}) => {
                return <Box display={'flex'}>
                    <CategoryIcon iconId={value.iconId} sx={{mt: '14px', mr: 1}}/>
                    {value.name}
                </Box>;
            },
            valueFormatter: (value) => `${(value as CategoryItem).name}`,
            sortComparator: (v1, v2) => v1.name.localeCompare(v2.name),
        },
        {
          field: 'amount',
          headerName: 'Amount',
          //type: 'number',
          align: 'right',
          headerAlign: 'right',
          minWidth: 100,
          flex: 1,
          editable: false,
          renderCell: (params) => {
            return (
            <Typography component={'span'} color={amountColor(params.value.type)}>
                {formatAmount(params.value.value)} {params.value.currencySymbol}
            </Typography>
            );
          },
          valueFormatter: (value) => `${(value as AmountItem).value} ${(value as AmountItem).currencySymbol}`,
          sortComparator: (v1, v2) => v1.value - v2.value,
        },
        {
            field: 'actions',
            type: 'actions',
            width: 100,
            getActions: (params) => {
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        disabled={params.row.account === null}
                        onClick={() => handleEditButtonClick(Number(params.id))} />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => console.log(params)}
                        showInMenu />,
                ]
            },
          },
      ];

      const amountColor = (type: TransactionType) => {
            if (type === TransactionType.Expense)
                return 'error'
            else if (type === TransactionType.Income)
                return 'success.main'
      }
      
      const rows: TransactionRowItem[] = [
        { id: 1, account: 'Bank', category: {name:'Food', iconId: 2}, amount: { value: 100, type: TransactionType.Expense, currencySymbol: "zł"}, date: dayjs().toDate(), description: "" },
        { id: 2, account: 'Bank', category: {name:'Events', iconId: 3}, amount: { value: 100, type: TransactionType.Expense, currencySymbol: "zł"}, date: dayjs().toDate(), description: "" },
        { id: 3, account: 'Cash', category: {name:'Food', iconId: 2}, amount: { value: 400, type: TransactionType.Expense, currencySymbol: "zł"}, date: dayjs().toDate(), description: "" },
        { id: 4, account: 'Bank', category: {name:'Salary', iconId: 11}, amount: { value: 2000, type: TransactionType.Income, currencySymbol: "zł"}, date: dayjs().toDate(), description: "" },
        { id: 5, account: null, category: {name:'Other (Transportation)', iconId: 4}, amount: { value: 500, type: TransactionType.Expense, currencySymbol: "zł"}, date: dayjs().toDate(), description: "" },
      ];

    return ( 
    <>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Transactions</Divider>
                {/* <Paper>
                    <Box height={150}>

                    </Box>
                </Paper> */}
                <Paper>
                    <Box>
                        <DataGrid 
                            sx={{
                                display: 'grid',
                                gridTemplateRows: 'auto 1f auto',
                                '--DataGrid-overlayHeight': '300px'
                            }}
                            rows={rows}
                            columns={columns}
                            autoHeight
                            disableRowSelectionOnClick
                            autosizeOnMount
                            autosizeOptions={{
                                includeHeaders: false,
                                includeOutliers: true,
                                expand: true,
                            }}
                            disableDensitySelector
                            slots={{ toolbar: GridToolbar }}
                            slotProps={{
                                toolbar: {
                                  showQuickFilter: true,
                                  printOptions: { 
                                    disableToolbarButton: true 
                                  },
                                  sx: {
                                    px: 2,
                                    pt: 2,
                                    '& .MuiButton-root': {
                                        color: 'black',
                                        },
                                  }
                                },
                              }}
                        />
                    </Box>
                </Paper>
            </Stack>
        } />
    </>
    )
})