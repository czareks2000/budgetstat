import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { TransactionToDelete } from "../../../app/models/Transaction";
import { formatAmount } from "../../../app/utils/FormatAmount";

interface Props {
    open: boolean;
    setOpen: (state: boolean) => void;
    transaction: TransactionToDelete | undefined;
}

export default observer(function DeleteTransactionDialog({open, setOpen, transaction}: Props) {
    const {transactionStore: {deleteTransaction}} = useStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    if (!transaction) return <></>

    const handleDelete = () => {
        setIsSubmitting(true);
        deleteTransaction(transaction)
            .then(() => {
                setIsSubmitting(false);
                setOpen(false);
            });
    }

    const handleCancel = () => {
        setOpen(false);
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby='dialog-title'
                aria-describedby='dialog-description'>
                <DialogTitle id='dialog-title' >Confirm Transaction Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>
                            {transaction.category}: {formatAmount(transaction.amount)} {transaction.currencySymbol}
                        </Typography>
                        <Typography variant="body1">
                            Are you sure you want to delete this transaction?
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} autoFocus>Cancel</Button>
                    <LoadingButton
                        loading={isSubmitting}
                        onClick={handleDelete} 
                        color={'error'}>
                        Delete
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </>
    )
})