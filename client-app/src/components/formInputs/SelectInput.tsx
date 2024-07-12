import { Box, MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import { Option } from "../../app/models/Option";
import CategoryIcon from "../common/CategoryIcon";

interface Props {
    name: string;
    label?: string;
    options: Option[];
    minWidth?: number;
}

export default function SelectInput({minWidth, ...props}: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                {...props}
                select
                sx={{ minWidth: minWidth }}
                value={field.value}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                autoComplete='off'
            >   
                {props.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.iconId ? 
                        <>
                            <Box display={'flex'}>
                                <CategoryIcon iconId={option.iconId} fontSize="small" sx={{mr: 1}}/>
                                <>{option.text}</>
                            </Box> 
                        </>
                        :
                            <>{option.text}</>
                        }
                    </MenuItem>
                ))}
            </TextField>
        </>
    )
}