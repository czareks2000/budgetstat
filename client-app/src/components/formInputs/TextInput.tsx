import { TextField } from "@mui/material";
import { ErrorMessage, useField } from "formik";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    type?: string;
}

export default function TextInput(props: Props) {
    const [field] = useField(props.name);
    return (
        <>
            <TextField
                id={field.name}
                {...field} 
                {...props}
                autoComplete='off'
            />
            <ErrorMessage 
                name={field.name} 
                component="span" 
                className="error"
            />
        </>
        
    )
}