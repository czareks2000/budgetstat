import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import PreferencesCard from "./cards/DefaultCurrencyCard"
import UserSettingsCard from "./cards/UserSettingsCard"
import CategoriesCard from "./cards/CategoriesCard"

export default observer(function Preferences() {
    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>App Settings</Divider>
                <PreferencesCard/>
                <CategoriesCard/>
                <Divider>User Settings</Divider>
                <UserSettingsCard/>
            </Stack>
        } 
        />
    </>
    )
})