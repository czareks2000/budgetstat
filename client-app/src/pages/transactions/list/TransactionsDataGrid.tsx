import { Box, Paper, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes"
import { DataGrid, GridActionsCellItem, GridColDef, GridColumnVisibilityModel, GridPaginationModel, GridToolbar } from '@mui/x-data-grid';
import { Delete, Edit } from "@mui/icons-material"
import CategoryIcon from "../../../components/common/CategoryIcon"
import { formatAmount } from "../../../app/utils/FormatAmount"
import { TransactionType } from "../../../app/models/enums/TransactionType"
import { AmountItem, CategoryItem, TransactionRowItem, TransactionToDelete } from "../../../app/models/Transaction"
import { useStore } from "../../../app/stores/store"
import dayjs from "dayjs";
import { useState } from "react";
import DeleteTransactionDialog from "../dialogs/DeleteTransactionDialog";

export default observer(function TransactionsDataGrid() {
    const {transactionStore: {
        transactions, transactionsLoaded, amountColor,
        dataGridSettings, setDataGridSettings,
    }} = useStore();
    
    const handleEditButtonClick = (transactionId: number, type: TransactionType) => {
        router.navigate(`/transactions/${type}/${transactionId}/edit`);
    }

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [transactionToDelete, setTransactionToDelete] = useState<TransactionToDelete | undefined>(undefined);

    const handleDeleteButtonClick = (transaction: TransactionRowItem) => {
        console.log();
        setTransactionToDelete({
            index: transaction.id, 
            transactionId: transaction.transactionId, 
            type: transaction.amount.type,
            category: transaction.category.name,
            categoryId: transaction.category.id,
            amount: transaction.amount.value,
            currencySymbol: transaction.amount.currencySymbol,
            toAccountId: transaction.accountId
        })
        setOpenDeleteDialog(true);
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
            field: 'accountName',
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
                const transaction = params.row;
                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label="Edit"
                        disabled={params.row.accountId === null}
                        onClick={() => handleEditButtonClick(Number(transaction.transactionId), transaction.amount.type)} />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label="Delete"
                        onClick={() => 
                            handleDeleteButtonClick(transaction)}/>,
                ]
            },
          },
    ];

    const handleColumnVisibilityModelChange = (newModel: GridColumnVisibilityModel) => {
        setDataGridSettings({
            id: newModel.id,
            date: newModel.date,
            account: newModel.accountName,
            category: newModel.category,
            description: newModel.description,
            amount: newModel.amount,
            actions: newModel.actions,
            itemsPerPage: dataGridSettings.itemsPerPage
        })
    }

    const [key, setKey] = useState(0);

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setDataGridSettings({
            ...dataGridSettings,
            itemsPerPage: newModel.pageSize
        })

        setKey(prevKey => prevKey + 1);
    }

    return (
    <>  
        <DeleteTransactionDialog 
            open={openDeleteDialog} setOpen={setOpenDeleteDialog}
            transaction={transactionToDelete} />
        <Paper>
            <Box>
                <DataGrid 
                    key={key}
                    sx={{
                        display: 'grid',
                        gridTemplateRows: 'auto 1f auto',
                        '--DataGrid-overlayHeight': '300px'
                    }}
                    loading={!transactionsLoaded}
                    rows={transactions}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: dataGridSettings.itemsPerPage, page: 0 },
                        },
                        columns: {
                            columnVisibilityModel: {
                                id: dataGridSettings.id,
                                date: dataGridSettings.date,
                                accountName: dataGridSettings.account,
                                category: dataGridSettings.category,
                                description: dataGridSettings.description,
                                amount: dataGridSettings.amount,
                                actions: dataGridSettings.actions, 
                            },
                        },
                    }}
                    onColumnVisibilityModelChange={handleColumnVisibilityModelChange}
                    onPaginationModelChange={handlePaginationModelChange}
                    pageSizeOptions={[10, 25, 50, 100]}
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
    </> 
    )
})