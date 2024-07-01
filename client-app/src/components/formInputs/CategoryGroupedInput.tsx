import { Autocomplete, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { CategoryOption } from "../../app/models/Category";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    options: CategoryOption[];
}

export default function CategoryGroupedInput(props: Props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(props.name);

    const handleChange = (_: any, value: CategoryOption[]) => {
        setFieldValue(field.name, value);
    };

    return (
        <>
            <Autocomplete
                id={field.name}
                {...field}
                multiple
                disableCloseOnSelect
                onChange={handleChange}
                options={props.options}
                groupBy={(option) => option.mainCategoryName}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => 
                <TextField
                    {...props}
                    {...params}
                    value={field.value}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    autoComplete='off'/>}
            />
        </>
    )
}