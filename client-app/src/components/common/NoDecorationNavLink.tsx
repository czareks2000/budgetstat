import { NavLink } from "react-router-dom";
import { Link as MuiLink } from "@mui/material"

interface Props {
    to: string;
    content: React.ReactNode;
    className?: string;
}

const NoDecorationNavLink = ({to, content, className}: Props) => {
  return (
    <MuiLink 
        component={NavLink} 
        to={to}
        underline='none' color='inherit'
        className={className}
        >
            {content}
    </MuiLink>
  )
}

export default NoDecorationNavLink