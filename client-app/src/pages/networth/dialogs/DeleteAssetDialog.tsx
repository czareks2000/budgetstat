import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { router } from "../../../app/router/Routes";

interface Props {
    redirect?: boolean
    open: boolean;
    setOpen: (state: boolean) => void;
}

export default observer(function DeleteAssetDialog({open, setOpen, redirect}: Props) {
    const {assetStore: {deleteAsset, selectedAsset: asset}} = useStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleDelete = () => {
        setIsSubmitting(true);
        deleteAsset(asset!.id)
            .then(() => {
                setIsSubmitting(false);
                setOpen(false);
                if (redirect)
                    router.navigate('/net-worth');
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
                <DialogTitle id='dialog-title'>Confirm Asset Deletion</DialogTitle>
                <DialogContent>
                    <Box id='dialog-description'>
                        <Typography variant="body1" mb={2}>
                            Are you sure you want to delete this asset ({asset?.name})?
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