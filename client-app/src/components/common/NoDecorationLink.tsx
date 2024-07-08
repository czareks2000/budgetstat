import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material"

interface Props {
    to: string;
    content: React.ReactNode;
}

const NoDecorationLink = ({to, content}: Props) => {
  return (
    <MuiLink 
        component={Link} 
        to={to}
        underline='none' color='inherit'
        >
            {content}
    </MuiLink>
  )
}

export default NoDecorationLink
