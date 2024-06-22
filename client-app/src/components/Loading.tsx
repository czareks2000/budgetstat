import { CircularProgress, Stack } from "@mui/material"

const Loading = () => {
  return (
    <>
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            <CircularProgress />
        </Stack>
    </>
  )
}

export default Loading
