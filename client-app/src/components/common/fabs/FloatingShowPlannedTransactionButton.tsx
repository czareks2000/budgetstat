import { EditCalendar } from "@mui/icons-material"
import { Fab } from "@mui/material"

interface Props {
    position?: number;
    onClick: () => void;
}

const FloatingShowPlannedTransactionButton = ({position = 0, onClick}: Props) => {
  return (
    <Fab 
        color={"info"} 
        aria-label="show planned transactions"
        onClick={onClick} 
        sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(4 + (position * 8)),
            right: (theme) => theme.spacing(4)
        }}>
        <EditCalendar />
    </Fab>
  )
}

export default FloatingShowPlannedTransactionButton