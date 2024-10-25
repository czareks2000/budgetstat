import { Link } from "react-router-dom";
import { Link as MuiLink } from "@mui/material"

interface Props {
    to: string;
    content: React.ReactNode;
    disabled?: boolean;
}


const NoDecorationLink = ({to, content, disabled = false}: Props) => {
  return (
    <>
    {disabled ?
    <>
      {content}
    </>
    : 
    <MuiLink 
      component={Link} 
      to={to}
      underline='none' color='inherit'
      >
          {content}
    </MuiLink>
    }
    </>
  )
}

export default NoDecorationLink
