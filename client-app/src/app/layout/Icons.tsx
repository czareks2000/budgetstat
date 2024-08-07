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
        icon: (props) => <SelfImprovement {...props} />, name: "SelfImprovement" }],
    [4, { 
        icon: (props) => <Commute {...props} />, name: "Commute" }],
    [5, { 
        icon: (props) => <Flight {...props} />, name: "Flight" }],
    [6, { 
        icon: (props) => <MedicalServices {...props} />, name: "MedicalServices" }],
    [7, { 
        icon: (props) => <ShowChart {...props} />, name: "ShowChart" }],
    [8, { 
        icon: (props) => <AccountBalance {...props} />, name: "AccountBalance" }],
    [9, { 
        icon: (props) => <ShoppingCart {...props} />, name: "ShoppingCart" }],
    [10, { 
        icon: (props) => <ChildFriendly {...props} />, name: "ChildFriendly" }],
    [11, { 
        icon: (props) => <Paid {...props} />, name: "Paid" }],
    [12, { 
        icon: (props) => <MapsHomeWork {...props} />, name: "MapsHomeWork" }],
    [13, { 
        icon: (props) => <DirectionsCar {...props} />, name: "DirectionsCar" }],
    [14, { 
        icon: (props) => <ShowChart {...props} />, name: "ShowChart" }], // to zmienic
    [15, { 
        icon: (props) => <Help {...props} />, name: "Help" }],
    [16, { 
        icon: (props) => <SwapHoriz {...props} />, name: "SwapHoriz" }]
]);
