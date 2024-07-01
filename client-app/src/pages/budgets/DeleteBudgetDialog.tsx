import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
    open: boolean;
    setOpen: (state: boolean) => void;
}

export default observer(function DeleteBudgetDialog({open, setOpen}: Props) {
    const {budgetStore: {selectedBudget, deleteBudget}} = useStore();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = () => {
        setIsSubmitting(true);
        deleteBudget(selectedBudget!.id)
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
                <DialogTitle id='dialog-title'>Confirm Budget Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>Are you sure you want to delete the "{selectedBudget?.name}" budget?</Typography> 
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