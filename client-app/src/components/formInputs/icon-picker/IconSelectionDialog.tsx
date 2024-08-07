import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Box, Button, Tooltip } from '@mui/material';
import { Icons } from '../../../app/layout/Icons';

interface IconSelectionDialogProps {
    currentIconId?: number | string;
    open: boolean;
    onClose: () => void;
    onSelect: (iconId: number) => void;
}

const IconSelectionDialog = ({ currentIconId, open, onClose, onSelect }: IconSelectionDialogProps) => {
    return (
        <Dialog open={open} onClose={onClose} aria-modal={true}>
            <DialogTitle>Select an Icon</DialogTitle>
            <DialogContent>
                <Box display="flex" flexWrap="wrap" gap={2}>
                    {Array.from(Icons.entries()).map(([iconId, { icon, name }]) => (
                        <Tooltip key={iconId} title={name}>
                            <IconButton
                                color={currentIconId == iconId ? 'inherit' : 'default'}
                                onClick={() => {
                                    onSelect(iconId);
                                    onClose();
                                }}
                            >
                                {icon({ fontSize: 'large' })}
                            </IconButton>
                        </Tooltip>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

export default IconSelectionDialog;