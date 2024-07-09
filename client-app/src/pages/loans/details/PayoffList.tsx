import { Delete } from "@mui/icons-material"
import { IconButton, List, ListItem, ListItemText, Paper } from "@mui/material"
import { formatAmount } from "../../../app/utils/FormatAmount"
import { convertToString } from "../../../app/utils/ConvertToString"
import { Payoff } from "../../../app/models/Payoff"

interface Props {
  payoffs: Payoff[]
  currencySymbol: string;
  onDelete: (payoffId: number) => void;
}

const PayoffList = ({payoffs, currencySymbol, onDelete}: Props) => {
  
  const sortedPayoffs = payoffs.slice().sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Paper>
        <List disablePadding>
        {sortedPayoffs.map((payoff, index) => 
        
            <ListItem 
                key={payoff.id}
                divider={payoffs.length > index+1}
                secondaryAction={
                  <IconButton 
                    edge={"end"} aria-label="delete" 
                    onClick={() => onDelete(payoff.id)}>
                    <Delete/>
                  </IconButton>
                }>
                <ListItemText primary={
                    `${formatAmount(payoff.amount)} ${currencySymbol} - ${convertToString(payoff.date)} `}
                    secondary={payoff.description || <i>(no description)</i>}/>
            </ListItem>                    
        )}
        </List>
    </Paper>
  )
}

export default PayoffList
