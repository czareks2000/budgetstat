import { ArrowBack } from "@mui/icons-material"
import { Fab } from "@mui/material"

interface Props {
    position?: number;
    onClick: () => void;
}

const FloatingGoBackButton = ({position = 0, onClick}: Props) => {
  return (
    <Fab 
        color={"primary"} 
        aria-label="go back"
        onClick={onClick} 
        sx={{
            '&:hover': {
              backgroundColor: '#5e5e5e',
            },
            backgroundColor: "gray",
            position: "fixed",
            bottom: (theme) => theme.spacing(4 + (position * 8)),
            right: (theme) => theme.spacing(4)
        }}>
        <ArrowBack />
    </Fab>
  )
}

export default FloatingGoBackButton