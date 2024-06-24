import { TextField } from "@mui/material";
import { useField } from "formik";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
}

export default function NumberInput(props: Props) {
    const [field, meta] = useField(props.name);
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                {...props}
                value={field.value === null ? '' : field.value}
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
                autoComplete='off'
            />
        </>
        
    )
}