import { IconButton, ListItem, ListItemText, Tooltip, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { Delete } from "@mui/icons-material";
import { formatAmount } from "../../../app/utils/FormatAmount";
import dayjs from "dayjs";
import { AssetValue } from "../../../app/models/Asset";

interface Props {
  assetValue: AssetValue;
  index: number;
}

export default observer(function AssetValueHistory({assetValue, index}: Props) {
  const {
    assetStore: {
      selectedAssetValues, deleteAssetValue},
      currencyStore: {getCurrencySymbol}
  } = useStore();

  return (
    <ListItem 
        key={assetValue.id}
        divider={selectedAssetValues.length > index+1}
        secondaryAction={
        <Tooltip placement="left" arrow
        title={selectedAssetValues.length === 1 ? 
        "You cannot delete a value if it is the only one" : ""}>
        <span>
        <IconButton 
            edge={"end"} aria-label="delete" 
            disabled={selectedAssetValues.length === 1}
            onClick={() => deleteAssetValue(assetValue.id)}
            >
            <Delete/>
        </IconButton>
        </span>
        </Tooltip>
        }>
        <ListItemText primary={
            <Typography variant="body1">
            {formatAmount(assetValue.value)} {getCurrencySymbol(assetValue.currencyId)}
            </Typography>}
            secondary={<i>{dayjs(assetValue.date).format("DD.MM.YYYY - HH:mm")}</i>}
            />
    </ListItem>                    
  )
})