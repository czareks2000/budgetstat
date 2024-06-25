import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
    open: boolean;
    setOpen: (state: boolean) => void;
}

export default observer(function Accounts({open, setOpen}: Props) {
    const {accountStore: {selectedAccount, deleteAccount}} = useStore();

    const [deleteRelatedTransactions, setDeleteRelatedTransactions] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        deleteAccount(selectedAccount!.id, deleteRelatedTransactions)
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
                <DialogTitle id='dialog-title'>Confirm Account Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>Are you sure you want to delete the "{selectedAccount?.name}"?</Typography> 
                        <Typography variant="body1">If you check the box below, all related transactions associated with this account will also be deleted.</Typography> 
                    </Box>
                    <Box ml={2} mt={2}>
                        <FormControlLabel 
                            control={
                                <Checkbox
                                    checked={deleteRelatedTransactions}
                                    onChange={(event) => setDeleteRelatedTransactions(event.target.checked)}
                                />
                            } 
                            label='Delete related transactions'/>
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