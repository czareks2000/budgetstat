import { TextField } from "@mui/material";
import { useField } from "formik";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    type?: string;
    fullWidth?: boolean;
}

export default function TextInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                {...props}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                autoComplete='off'
            />
        </>
        
    )
}