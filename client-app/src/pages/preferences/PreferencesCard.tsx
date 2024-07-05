import { Button, Card, CardContent, MenuItem, Stack, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../app/stores/store";

export default observer(function PreferencesCard() {
    const {currencyStore: {currenciesAsOptions, changeDefaultCurrency, defaultCurrency}} = useStore();

    const [currencyId, setCurrencyId] = useState(defaultCurrency?.id);

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyId(parseInt(event.target.value));
    }

    const handleSaveButtonClick = () => {
        changeDefaultCurrency(currencyId as number);
    }
    
    return (
        <Card>
            <CardContent>
                <Stack spacing={2} p={1}>
                    <TextField
                        select
                        label={"Default currency"}
                        fullWidth
                        value={currencyId}
                        onChange={handleCurrencyChange}
                    >
                    {currenciesAsOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.text}
                        </MenuItem>
                    ))}
                    </TextField>
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={defaultCurrency?.id === currencyId}
                        onClick={handleSaveButtonClick}
                    >
                        Save
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    )
})