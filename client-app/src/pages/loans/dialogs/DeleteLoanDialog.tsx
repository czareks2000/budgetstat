import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Loan } from "../../../app/models/Loan";
import { router } from "../../../app/router/Routes";
import { LoanStatus } from "../../../app/models/enums/LoanStatus";

interface Props {
    loan: Loan;
    redirectAfterSubmit: boolean;
    open: boolean;
    setOpen: (state: boolean) => void;
}

export default observer(function DeleteLoanDialog({loan, redirectAfterSubmit, open, setOpen}: Props) {
    const {loanStore: {deleteLoan}} = useStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        deleteLoan(loan.id)
            .then(() => {
                setIsSubmitting(false);
                setOpen(false);
                if (redirectAfterSubmit)
                    router.navigate(`/loans/counterparty/${loan.counterpartyId}`);
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
                <DialogTitle id='dialog-title'>Confirm Loan Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>
                            Are you sure you want to delete this loan?
                            </Typography>
                        <Typography variant="body1" mb={2}>
                            Repayment history will be deleted.
                        </Typography>
                        {loan.loanStatus === LoanStatus.InProgress &&
                        <Typography variant="body1">
                            The account balances will be restored.
                        </Typography>}  
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