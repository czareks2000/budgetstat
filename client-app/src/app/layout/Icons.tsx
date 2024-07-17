import { 
    AccountBalance, ChildFriendly, Commute, 
    DirectionsBike, DirectionsCar, Flight, 
    Help, Home, MapsHomeWork, MedicalServices, 
    Paid, Restaurant, ShoppingCart, ShowChart, SwapHoriz } from '@mui/icons-material'
import { SvgIconProps } from '@mui/material';

interface IconItem {
    icon: (props: SvgIconProps) => JSX.Element;
    name: string;
}

export const Icons = new Map<number, IconItem>([
    [1, { 
        icon: (props) => <Home {...props} />, name: "home" }],
    [2, { 
        icon: (props) => <Restaurant {...props} />, name: "food" }],
    [3, { 
        icon: (props) => <DirectionsBike {...props} />, name: "recreation" }],
    [4, { 
        icon: (props) => <Commute {...props} />, name: "transportation" }],
    [5, { 
        icon: (props) => <Flight {...props} />, name: "travels" }],
    [6, { 
        icon: (props) => <MedicalServices {...props} />, name: "health" }],
    [7, { 
        icon: (props) => <ShowChart {...props} />, name: "investment" }],
    [8, { 
        icon: (props) => <AccountBalance {...props} />, name: "financial" }],
    [9, { 
        icon: (props) => <ShoppingCart {...props} />, name: "shopping" }],
    [10, { 
        icon: (props) => <ChildFriendly {...props} />, name: "kids" }],
    [11, { 
        icon: (props) => <Paid {...props} />, name: "earnings" }],
    [12, { 
        icon: (props) => <MapsHomeWork {...props} />, name: "property" }],
    [13, { 
        icon: (props) => <DirectionsCar {...props} />, name: "movable_property" }],
    [14, { 
        icon: (props) => <ShowChart {...props} />, name: "investment" }],
    [15, { 
        icon: (props) => <Help {...props} />, name: "other" }],
    [16, { 
        icon: (props) => <SwapHoriz {...props} />, name: "transfer" }]
]);
