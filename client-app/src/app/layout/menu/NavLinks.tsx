import { Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";

interface NavLinkItem{
    text: string;
    icon: JSX.Element;
    link: string;
}

interface Props {
    items: NavLinkItem[];
  }
  
  const NavLinks = ({ items }: Props) => {
    return (
        <List>
            {items.map((item, index) => (
            <Link component={NavLink} key={index} to={item.link} underline='none' color='inherit'>
                <ListItem disablePadding >  
                    <ListItemButton disableRipple>
                        <ListItemIcon 
                            sx={{
                                color: 'white'
                            }}>
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                </ListItem>
            </Link>
        ))}
        </List>
    )
  }
  
  export default NavLinks