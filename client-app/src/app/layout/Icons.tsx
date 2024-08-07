import { 
    AccountBalance, ChildFriendly, Commute, 
    DirectionsCar, Flight, 
    Help, Home, MapsHomeWork, MedicalServices, 
    Paid, Restaurant, SelfImprovement, ShoppingCart, ShowChart, SwapHoriz } from '@mui/icons-material'
import { SvgIconProps } from '@mui/material';

interface IconItem {
    icon: (props: SvgIconProps) => JSX.Element;
    name: string;
}

export const Icons = new Map<number, IconItem>([
    [1, { 
        icon: (props) => <Home {...props} />, name: "Home" }],
    [2, { 
        icon: (props) => <Restaurant {...props} />, name: "Restaurant" }],
    [3, { 
        icon: (props) => <SelfImprovement {...props} />, name: "Self Improvement" }],
    [4, { 
        icon: (props) => <Commute {...props} />, name: "Commute" }],
    [5, { 
        icon: (props) => <Flight {...props} />, name: "Flight" }],
    [6, { 
        icon: (props) => <MedicalServices {...props} />, name: "Medical Services" }],
    [7, { 
        icon: (props) => <ShowChart {...props} />, name: "Show Chart" }],
    [8, { 
        icon: (props) => <AccountBalance {...props} />, name: "Account Balance" }],
    [9, { 
        icon: (props) => <ShoppingCart {...props} />, name: "Shopping Cart" }],
    [10, { 
        icon: (props) => <ChildFriendly {...props} />, name: "Child Friendly" }],
    [11, { 
        icon: (props) => <Paid {...props} />, name: "Paid" }],
    [12, { 
        icon: (props) => <MapsHomeWork {...props} />, name: "Maps Home Work" }],
    [13, { 
        icon: (props) => <DirectionsCar {...props} />, name: "Directions Car" }],
    [14, { 
        icon: (props) => <ShowChart {...props} />, name: "Show Chart" }], // to zmienic
    [15, { 
        icon: (props) => <Help {...props} />, name: "Help" }],
    [16, { 
        icon: (props) => <SwapHoriz {...props} />, name: "Swap Horiz" }]
]);
