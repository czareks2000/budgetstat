import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { theme } from "../Theme";
import NoDecorationNavLink from "../../../components/common/NoDecorationNavLink";
import { useLocation } from "react-router-dom";

interface NavLinkItem{
    text: string;
    icon: JSX.Element;
    link: string;
}

interface Props {
    items: NavLinkItem[];
  }
  
  const NavLinks = ({ items }: Props) => {
    const location = useLocation();

    return (
        <List>
            {items.map((item, index) => {

            const isActive = location.pathname === '/' && item.text === 'Home';
                
            return(
                <NoDecorationNavLink key={index} to={item.link} 
                    className={isActive ? 'active' : ''} content={
                    <ListItem disablePadding>  
                        <ListItemButton disableRipple
                            sx={{
                                '&:hover': {
                                    '& .MuiListItemText-primary': {
                                        color: theme.palette.primary.main,
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: theme.palette.primary.main,
                                    },
                                },
                            }}>
                            <ListItemIcon 
                                className="MuiListItemIcon-root"
                                sx={{ color: 'white'}}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} 
                                primaryTypographyProps={{
                                    className: 'MuiListItemText-primary',
                                }}/>
                        </ListItemButton>
                    </ListItem>
                }/>)
        })}
        </List>
    )
  }
  
  export default NavLinks