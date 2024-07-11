import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { router } from "../../app/router/Routes";
import { Counterparty } from "../../app/models/Counterparty";

interface Props {
    counterparty: Counterparty;
    redirectAfterSubmit: boolean;
    open: boolean;
    setOpen: (state: boolean) => void;
}

export default observer(function DeleteCounterpartyDialog({counterparty, redirectAfterSubmit, open, setOpen}: Props) {
    const {loanStore: {deleteCounterparty}} = useStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        deleteCounterparty(counterparty.id)
            .then(() => {
                setIsSubmitting(false);
                setOpen(false);
                if (redirectAfterSubmit)
                    router.navigate(`/loans`);
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
                <DialogTitle id='dialog-title'>Confirm Counterparty Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>
                            Are you sure you want to delete this counterparty ({counterparty.name})?
                            </Typography>
                        <Typography variant="body1" mb={2}>
                            Loans and repayment histories will be deleted.
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