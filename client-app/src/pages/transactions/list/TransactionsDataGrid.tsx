import { Box, Paper, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes"
import { DataGrid, GridActionsCellItem, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit } from "@mui/icons-material"
import CategoryIcon from "../../../components/common/CategoryIcon"
import { formatAmount } from "../../../app/utils/FormatAmount"
import { TransactionType } from "../../../app/models/enums/TransactionType"
import { AmountItem, CategoryItem, TransactionRowItem } from "../../../app/models/Transaction"
import { useStore } from "../../../app/stores/store"
import dayjs from "dayjs";

export default observer(function TransactionsDataGrid() {
    const {transactionStore: {transactions, transactionsLoaded}} = useStore();
    
    const handleEditButtonClick = (transactionId: number) => {
        router.navigate(`/transactions/${transactionId}/edit`);
    }

    const handleDeleteButtonClick = (transactionId: number) => {
        console.log(transactionId);
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
            renderCell: (params) => {
                return dayjs(params.value).format('DD.MM.YYYY');
            },
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
                return <Box component={"span"} display={'flex'}>
                    <CategoryIcon iconId={value.iconId} sx={{mt: '14px', mr: 1}}/>
                    {value.name}
                </Box>;
            },
            valueFormatter: (value) => `${(value as CategoryItem).name}`,
            sortComparator: (v1, v2) => v1.name.localeCompare(v2.name),
        },
        {
            field: 'description',
            headerName: 'Description',
            editable: false,
            hideable: true,
            renderCell: (params) => {
                return params.value || <i>(no description)</i>
            },
            valueFormatter: (value) => `${value || '(deleted)'}`,
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
                        onClick={() => handleEditButtonClick(Number(params.row.transactionId))} />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => handleDeleteButtonClick(params.row.transactionId)}/>,
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
      
    return ( 
    <Paper>
        <Box>
            <DataGrid 
                key={Number(dayjs())}
                sx={{
                    display: 'grid',
                    gridTemplateRows: 'auto 1f auto',
                    '--DataGrid-overlayHeight': '300px'
                }}
                loading={!transactionsLoaded}
                rows={transactions}
                initialState={{
                    columns: {
                      columnVisibilityModel: {
                        description: false, 
                      },
                    },
                  }}
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
                disableColumnFilter
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
    )
})