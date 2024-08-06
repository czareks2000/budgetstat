import { Add } from "@mui/icons-material"
import { Fab } from "@mui/material"

interface Props {
    position?: number;
    onClick: () => void;
}

const FloatingAddButton = ({position = 0, onClick}: Props) => {
  return (
    <Fab 
        color="primary" 
        aria-label="add"
        onClick={onClick} 
        sx={{
            position: "fixed",
            bottom: (theme) => theme.spacing(4 + (position * 8)),
            right: (theme) => theme.spacing(4)
        }}>
        <Add />
    </Fab>
  )
}

export default FloatingAddButton
