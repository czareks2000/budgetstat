import { observer } from "mobx-react-lite"
import { Box, Divider, Paper, Stack, Tooltip, Typography, styled } from "@mui/material"
import { useStore } from "../../app/stores/store"
import { CloudUpload } from "@mui/icons-material";
import { useRef } from "react";
import { LoadingButton } from "@mui/lab";
import ImportedTransactionsList from "./ImportedTransactionsList";

interface Props {
    setSnackbarOpen: (state: boolean) => void;
    setSnackbarMessage: (message: string) => void;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export default observer(function ImportPanel({setSnackbarMessage, setSnackbarOpen}: Props) {
    const {fileStore: {
        importTransactions, importedTransactions, undoImport, undoInProgress, importInProgress}
    } = useStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadTransactions = async (files: FileList | null) => {
        if (!files)
        {
            setSnackbarMessage(`No file has been uploaded`);
            setSnackbarOpen(true);
            return;
        }
        if (files.item(1))
        {
            setSnackbarMessage(`More than one file uploaded`);
            setSnackbarOpen(true);
            return;
        }

        importTransactions(files[0]).catch((error) => {
            setSnackbarMessage(`Error uploading file: ${error}`);
            setSnackbarOpen(true);
            console.log(error);
        }).finally(() => {
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        });
    }

    const handelUndoImport = async () => {
        undoImport();
    }

    return (<>
        <Stack spacing={2}>
            <Paper>
                <Box p={2}>
                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Stack spacing={1}>
                            <Typography>Import transactions from CSV file</Typography>
                            <Typography variant="subtitle2"><i>The CSV file should have the same format as in the export.</i></Typography>
                        </Stack>
                        <Box display={'flex'} gap={1}>
                        <Tooltip 
                            title={
                                <Stack p={1} spacing={1}>
                                    <Typography variant="body2">Before importing, create categories and accounts.</Typography>
                                    <Typography variant="body2">Account and category names in the file must match those in the application.</Typography>
                                    <Typography variant="body2">Transfers are not included in the import and must be added manually later.</Typography>
                                    <Typography variant="body2">Required headers:</Typography>
                                    <Typography variant="body2">Date, Type, Amount, Currency, Description, Account, MainCategory, Category, Considered</Typography>
                                </Stack>
                            }
                            placement="left"
                            arrow
                        >
                            <LoadingButton
                                loading={importInProgress}
                                component="label"
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Upload file
                                <VisuallyHiddenInput
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(event) => uploadTransactions(event.target.files)}
                                />
                            </LoadingButton>
                        </Tooltip>
                        {importedTransactions.length > 0 && 
                            <LoadingButton
                                loading={undoInProgress}
                                component="label"
                                variant="contained"
                                onClick={handelUndoImport}
                            >
                                Undo import
                            </LoadingButton>
                        }
                        </Box>
                    </Box>
                    
                </Box>
            </Paper>
            {importedTransactions.length > 0 && <>
            <Paper>
                <Box>
                    <Typography p={2}>Recently imported transactions</Typography>
                    <Divider/>
                    <ImportedTransactionsList />
                </Box>
            </Paper>
            </>}
        </Stack>
    </>
    )
})