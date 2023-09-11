import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import TaskModel from '../../models/task.model';
import { DotSpinner } from '@uiball/loaders';
interface PlanPanelProps {
    id?: string;
    data: TaskModel[];
    isLoading: boolean;
}

const PlanPanel: React.FC<PlanPanelProps> = ({ id, data, isLoading }) => {

    if (isLoading) {
        return (

            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <DotSpinner
                    size={40}
                    speed={0.9}
                    color="black"
                />
            </div>

        );
    }
    else {
        return (
            <div className='plan-panel-container' id={id} style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignContent: 'start',
                width: '100%',
                overflowY: 'auto'
            }}>
                {
                    data.map((e) => (
                        <Card sx={{ width: '200px', margin: '16px', padding: '4px', display: 'flex', height: '120px',justifyContent:'space-between' }}>
                            <div>
                                <CardContent sx={{ margin: 0, padding: '0px 0px 4px 8px' }}>
                                    <Typography gutterBottom sx={{ margin: 0, fontSize: '15px' }} component="div">
                                        {e.client?.name}
                                    </Typography>
                                    <Typography variant="body2" sx={{ margin: 0, fontSize: '13px' }} color="text.secondary">
                                        spécialité: {e.client?.speciality}
                                    </Typography>
                                </CardContent>
                                <Typography sx={{ margin: "0px", fontSize: '12px' }} variant="body2" color="text.secondary">
                                    <LocationOnIcon sx={{ width: '20px' }} /> wilaya : {e.client?.wilaya}
                                </Typography>
                                <Typography sx={{ margin: "0px ", fontSize: '12px' }} variant="body2" color="text.secondary">
                                    <LocationOnIcon sx={{ width: '20px' }} /> commune : {e.client?.commune}
                                </Typography>
                            </div>
                            {
                                e.isDone ? (  <CheckCircleIcon style={{ display: 'block', position: 'relative', color: 'lime', right: 0, top: 0 }} />) : (  <HourglassBottomIcon style={{ display: 'block', position: 'relative', color: 'orange', right: 0, top: 0 }} />)
                            }
                          
                        </Card>
                    ))
                }

            </div>
        );
    }

};

export default PlanPanel;
