import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import PreferencesCard from "./PreferencesCard"
import UserSettingsCard from "./UserSettingsCard"
import CategoriesCard from "./CategoriesCard"

export default observer(function Preferences() {
    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>App Preferences</Divider>
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