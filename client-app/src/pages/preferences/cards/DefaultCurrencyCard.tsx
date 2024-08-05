import { Box, Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useStore } from "../../../app/stores/store";

export default observer(function DefaultCurrencyCard() {
    const {currencyStore: {currenciesAsOptions, changeDefaultCurrency, defaultCurrency}} = useStore();

    const [currencyId, setCurrencyId] = useState(defaultCurrency?.id);

    const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrencyId(parseInt(event.target.value));
    }

    const handleSaveButtonClick = () => {
        changeDefaultCurrency(currencyId as number);
    }
    
    return (
        <Paper>
            <Box p={2}>
                <Stack spacing={2}>

                    <Grid container display={'flex'} alignItems={'center'} gap={2}>
                        <Grid item xs={'auto'}>
                            <Typography>Default currency</Typography>
                        </Grid>

                        <Grid item xs>
                            <TextField
                                select
                                size="small"
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
                        </Grid>

                        <Grid item xs={'auto'}>
                            <Button
                                variant="contained"
                                disabled={defaultCurrency?.id === currencyId}
                                onClick={handleSaveButtonClick}
                            >
                                Save
                            </Button>
                        </Grid>
                    </Grid>

                </Stack>
            </Box>
        </Paper>
    )
})