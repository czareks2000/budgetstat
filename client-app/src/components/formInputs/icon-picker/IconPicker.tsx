// import { Box, IconButton, Tooltip, Typography, colors } from '@mui/material';
// import { Icons } from '../../../app/layout/Icons';
// import { useState } from 'react';
// import IconSelectionDialog from './IconSelectionDialog';
// import { Search } from '@mui/icons-material';

// interface Props {
//     value: number | string;
//     onChange: (iconId: number) => void;
// }

// const IconPicker = ({ value, onChange }: Props) => {
//     const [dialogOpen, setDialogOpen] = useState(false);

//     const handleOpenDialog = () => setDialogOpen(true);
//     const handleCloseDialog = () => setDialogOpen(false);
//     const handleSelectIcon = (iconId: number) => onChange(iconId);
    
//     return (
//         <>
//             <Box 
//                 display="flex" alignItems="center"
//                 border={1}
//                 borderColor={colors.grey[400]}
//                 borderRadius={1}
//                 p={1}
//                 pl={2}
//                 onClick={handleOpenDialog}>
//                 {value !== undefined && value !== '' ? (<>
//                     <Typography mr={1}>Selected Icon: </Typography>
//                     <Tooltip title="Change Icon">
//                         <IconButton color="inherit">
//                             {Icons.get(Number(value))!.icon({ fontSize: 'medium' })}
//                         </IconButton>
//                     </Tooltip>
//                 </>
//                 ) : (<>
//                     <Typography mr={1}>Select Icon: </Typography>
//                     <Tooltip title="Select Icon">
//                         <IconButton color="default">
//                             <Search fontSize='medium'/>
//                         </IconButton>
//                     </Tooltip>
//                 </>
//                 )}
//             </Box>
//             <IconSelectionDialog
//                 open={dialogOpen}
//                 onClose={handleCloseDialog}
//                 onSelect={handleSelectIcon}
//             />
//         </>
//     );
// };

// export default IconPicker;

import { IconButton, TextField, Tooltip } from '@mui/material';
import { Icons } from '../../../app/layout/Icons';
import { useState } from 'react';
import IconSelectionDialog from './IconSelectionDialog';
import { Search } from '@mui/icons-material';
import { useField } from 'formik';

interface Props {
    name: string;
    value: number | string;
    onChange: (iconId: number) => void;
}

const IconPicker = ({ name, value, onChange }: Props) => {
    const [field, meta] = useField(name);

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpenDialog = () => setDialogOpen(true);
    const handleCloseDialog = () => setDialogOpen(false);
    const handleSelectIcon = (iconId: number) => onChange(iconId);
    
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                error={meta.touched && Boolean(meta.error) && !dialogOpen}
                helperText={!dialogOpen ? meta.touched && meta.error : ''}
                autoComplete='off'
                fullWidth
                label={"Icon"}
                variant="outlined"
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <Tooltip title={value ? "Change Icon" : "Select Icon"}>
                            <IconButton
                                onClick={handleOpenDialog}
                                color={value ? 'inherit' : 'default'}
                            >
                                {value !== undefined && value !== '' ? (
                                    Icons.get(Number(value))!.icon({ fontSize: 'medium' })
                                ) : (
                                    <Search fontSize='medium'/>
                                )}
                            </IconButton>
                        </Tooltip>
                    ),
                }}
                value={value !== undefined && value !== '' ? Icons.get(Number(value))!.name : ''}
                sx={{
                    '& .MuiInputBase-input': {
                        cursor: 'pointer'
                    }
                }}
                onClick={handleOpenDialog}
            />
            <IconSelectionDialog
                currentIconId={value}
                open={dialogOpen}
                onClose={handleCloseDialog}
                onSelect={handleSelectIcon}
            />
        </>
    );
};

export default IconPicker;