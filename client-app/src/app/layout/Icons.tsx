import { 
    AccountBalance, Apartment, AttachMoney, Build, 
    Business, Cable, Chair, Checkroom, ChildFriendly, 
    Coffee, Commute, CurrencyExchange, DirectionsCar, 
    DirectionsRun, ElderlyWoman, Event, EventRepeat, 
    FitnessCenter, Flight,FormatPaint, Handyman, 
    Help, Home, Kitchen, LocalFlorist, LocalGasStation, 
    MapsHomeWork, MedicalInformation, MedicalServices, 
    Medication, MenuBook, Paid, Payments, Pets, 
    Psychology, Redeem, Restaurant, SafetyCheck, Sailing, 
    School, SelfImprovement, ShoppingCart, ShowChart, 
    Spa, SwapHoriz, Toys, VolunteerActivism, Work } from '@mui/icons-material'
import { SvgIconProps } from '@mui/material';

interface IconItem {
    icon: (props: SvgIconProps) => JSX.Element;
    name: string;
}

export const Icons = new Map<number, IconItem>([
    [1, { icon: (props) => <Home {...props} />, name: "Home" }],
    [2, { icon: (props) => <Restaurant {...props} />, name: "Restaurant" }],
    [3, { icon: (props) => <SelfImprovement {...props} />, name: "Self Improvement" }],
    [4, { icon: (props) => <Commute {...props} />, name: "Commute" }],
    [5, { icon: (props) => <Flight {...props} />, name: "Flight" }],
    [6, { icon: (props) => <MedicalServices {...props} />, name: "Medical Services" }],
    [7, { icon: (props) => <ShowChart {...props} />, name: "Show Chart" }],
    [8, { icon: (props) => <AccountBalance {...props} />, name: "Account Balance" }],
    [9, { icon: (props) => <ShoppingCart {...props} />, name: "Shopping Cart" }],
    [10, { icon: (props) => <ChildFriendly {...props} />, name: "Child Friendly" }],
    [11, { icon: (props) => <Paid {...props} />, name: "Paid" }],
    [12, { icon: (props) => <MapsHomeWork {...props} />, name: "Maps Home Work" }],
    [13, { icon: (props) => <DirectionsCar {...props} />, name: "Directions Car" }],

    [14, { icon: (props) => <Chair {...props} />, name: "Chair" }],

    [15, { icon: (props) => <Help {...props} />, name: "Help" }],

    [16, { icon: (props) => <SwapHoriz {...props} />, name: "Swap Horiz" }],

    [17, { icon: (props) => <Kitchen {...props} />, name: "Kitchen" }],
    [18, { icon: (props) => <FormatPaint {...props} />, name: "Format Paint" }],
    [19, { icon: (props) => <Handyman {...props} />, name: "Handyman" }],
    [20, { icon: (props) => <LocalFlorist {...props} />, name: "Local Florist" }],

    [21, { icon: (props) => <MenuBook {...props} />, name: "Menu Book" }],
    [22, { icon: (props) => <Event {...props} />, name: "Event" }],
    [23, { icon: (props) => <Coffee {...props} />, name: "Coffee" }],
    [24, { icon: (props) => <FitnessCenter {...props} />, name: "Fitness Center" }],
    [25, { icon: (props) => <EventRepeat {...props} />, name: "Event Repeat" }],

    [26, { icon: (props) => <CurrencyExchange {...props} />, name: "Currency Exchange" }],
    [27, { icon: (props) => <Build {...props} />, name: "Build" }],
    [28, { icon: (props) => <SafetyCheck {...props} />, name: "Safety Check" }],
    [29, { icon: (props) => <LocalGasStation {...props} />, name: "Local Gas Station" }],
    [30, { icon: (props) => <Payments {...props} />, name: "Payments" }],

    [31, { icon: (props) => <Apartment {...props} />, name: "Apartment" }],
    [32, { icon: (props) => <Sailing {...props} />, name: "Sailing" }],

    [33, { icon: (props) => <Medication {...props} />, name: "Medication" }],
    [34, { icon: (props) => <Psychology {...props} />, name: "Psychology" }],
    [35, { icon: (props) => <Spa {...props} />, name: "Spa" }],
    [36, { icon: (props) => <MedicalInformation {...props} />, name: "Medical Information" }],

    [37, { icon: (props) => <Business {...props} />, name: "Business" }],

    [38, { icon: (props) => <Redeem {...props} />, name: "Redeem" }],
    [39, { icon: (props) => <AttachMoney {...props} />, name: "Attach Money" }],
    [40, { icon: (props) => <VolunteerActivism {...props} />, name: "Volunteer Activism" }],

    [41, { icon: (props) => <Checkroom {...props} />, name: "Checkroom" }],
    [42, { icon: (props) => <Cable {...props} />, name: "Cable" }],
    [43, { icon: (props) => <School {...props} />, name: "School" }],
    [44, { icon: (props) => <Pets {...props} />, name: "Pets" }],

    [45, { icon: (props) => <DirectionsRun {...props} />, name: "Directions Run" }],
    [46, { icon: (props) => <Toys {...props} />, name: "Toys" }],

    [47, { icon: (props) => <Work {...props} />, name: "Work" }],
    [48, { icon: (props) => <ElderlyWoman {...props} />, name: "Elderly Woman" }],
]);
