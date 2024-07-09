import { Box, CircularProgress, CircularProgressProps, Typography, lighten } from '@mui/material'
import { theme } from '../../app/layout/Theme';

const CircularProgressWithLabel = (props: CircularProgressProps & { value: number, fontSize: string}) => {

    const mainColor = theme.palette[props.color as 'success' | 'error'].main;
    const backgroundColor = lighten(mainColor, 0.6);

    return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Blady CircularProgress z wartością 100 */}
        <CircularProgress
                variant="determinate"
                value={100}
                size={props.size}
                sx={{
                    color: backgroundColor,
                    position: 'absolute', // Aby znajdował się pod właściwym CircularProgress
                }}
        />
        {/* Właściwy CircularProgress */}
        <CircularProgress variant="determinate" {...props} />
        <Box
        sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        >
        <Typography
            variant="caption"
            component="div"
            color="text.primary"
            fontSize={props.fontSize}
        >{`${Math.round(props.value)}%`}</Typography>
        </Box>
    </Box>
    );
}

export default CircularProgressWithLabel
