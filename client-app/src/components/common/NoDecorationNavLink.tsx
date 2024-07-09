import { NavLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material"

interface Props {
    to: string;
    content: React.ReactNode;
}

const NoDecorationNavLink = ({to, content}: Props) => {
  return (
    <MuiLink 
        component={NavLink} 
        to={to}
        underline='none' color='inherit'
        >
            {content}
    </MuiLink>
  )
}

export default NoDecorationNavLink