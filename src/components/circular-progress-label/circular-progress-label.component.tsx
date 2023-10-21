import CircularProgress, {
    CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';

function CircularProgressLabel(
    props: CircularProgressProps & { 
        value: number, 
        firstTitle?: string, 
        secondTitle?: string, 
        colorStroke?: string, 
        direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
        formatter?: (val:number)=>string
    },
) {
    return (
        <div style={{ width: 'max-content', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: props.direction ?? 'column', margin: '0px 0px' }}>

            <Box sx={{ position: 'relative', display: 'inline-flex', width: '68px', height: '68px' }}>
                <div>
                    <CircularProgress value={100} size={68} sx={{ color: '#eeeeee', opacity: '0.5' }} variant="determinate" />
                    <CircularProgress size={68} sx={{ color: props.colorStroke ?? 'blue', position: 'absolute', top: 0, left: 0 }} variant="determinate"  {...props} />
                </div>
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
                        color='#333'
                    >{props.formatter ? props.formatter(props.value) : `${props.value.toFixed(2)}%`}</Typography>
                </Box>
            </Box>
            <div>
                {props.secondTitle ? (<Typography
                    variant="caption"
                    component="div"
                    color='#222'
                    fontWeight='bold'
                    fontSize={17}
                    sx={{ paddingLeft: props.direction === 'row' || props.direction === 'row-reverse' ? '8px' : '0px' }}
                >{props.secondTitle}</Typography>) : null}
                {props.firstTitle ? (<Typography
                    variant="caption"
                    component="div"
                    color='#333'
                    sx={{ paddingLeft: props.direction === 'row' || props.direction === 'row-reverse' ? '8px' : '0px' }}
                >{props.firstTitle}</Typography>) : null}
            </div>
        </div>
    );
}


export default CircularProgressLabel;