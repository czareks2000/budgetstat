import { Autocomplete, TextField } from "@mui/material";
import { useField, useFormikContext } from "formik";
import { CategoryOption } from "../../app/models/Category";

interface Props {
    name: string;
    placeholder?: string;
    label?: string;
    options: CategoryOption[];
    shrinkLabel?: boolean;
    multiple?: boolean;
}

export default function CategoryGroupedInput(props: Props) {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(props.name);

    const handleChange = (_: any, value: CategoryOption[]) => {
        setFieldValue(field.name, value);
    };

    const {shrinkLabel, multiple, ...restProps } = props;

    return (
        <>
            <Autocomplete
                id={field.name}
                {...field}
                multiple={multiple}
                disableCloseOnSelect={multiple}
                onChange={handleChange}
                options={restProps.options}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                groupBy={(option) => option.mainCategoryName}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => 
                <TextField
                    {...restProps}
                    {...params}
                    value={field.value}
                    slotProps={{ inputLabel: { shrink: shrinkLabel }}}
                    placeholder={multiple ? field.value.length > 0 ? "" : restProps.placeholder : ""}
                    error={meta.touched && Boolean(meta.error)}
                    helperText={meta.touched && meta.error}
                    autoComplete='off'/>}
            />
        </>
    )
}