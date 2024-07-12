
import { SvgIconProps } from '@mui/material';
import { Icons } from '../../app/layout/Icons';

interface IconProps extends SvgIconProps {
    iconId: number;
}

const CategoryIcon = ({ iconId, ...rest }: IconProps) => {
    const iconItem = Icons.get(iconId);

    if (!iconItem) {
        return null;
    }

    const Icon = iconItem.icon;

    return <Icon {...rest} />;
};

export default CategoryIcon;