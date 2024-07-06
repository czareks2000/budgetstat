import { MenuItem, TextField } from "@mui/material";
import { useField } from "formik";
import { Option } from "../../app/models/Option";

interface Props {
    name: string;
    label?: string;
    options: Option[];
}

export default function SelectInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                {...props}
                select
                value={field.value}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                autoComplete='off'
            >   
                {props.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.text}
                    </MenuItem>
                ))}
            </TextField>
        </>
    )
}