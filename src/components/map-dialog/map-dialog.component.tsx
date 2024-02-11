
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, SVGOverlay, Marker, useMapEvents } from 'react-leaflet'
import * as ll from "leaflet";
import "leaflet/dist/leaflet.css"
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import UserTrackingModel from '@/src/models/user-tracking.model';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DialogActions, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { formatTime } from '../../functions/date-format';


interface TrackingListProps {
    trackings: UserTrackingModel[],
}

const TrackingList: React.FC<TrackingListProps> = ({ trackings }) => {
    const [showDrawer, setShowDrawer] = useState(false);
    const mapCon = useMapEvents({
        click: () => {
        },
    });


    return (
        <>
            <div style={{
                width: showDrawer ? '200px' : '5px',
                height: '442px',
                position: 'absolute',
                zIndex: '999',
                backgroundColor: 'rgba(255,255,255,0.5)',
                right: '8px',
                border: 'solid #ddd 1px',
                borderRadius: '8px',
                top: '52px',
                overflowY: 'auto',
            }}>

                <List style={{
                    position: 'absolute',
                    zIndex: '999',
                }}>
                    {
                        trackings.map((track, index) => {
                            return (
                                <ListItem
                                    key={track.id}
                                    disablePadding
                                    onClick={() => {
                                        const point: ll.LatLng = ll.latLng(parseFloat(track.latitude!), parseFloat(track.longitude!));
                                        mapCon.flyTo(point, 18);
                                    }}
                                >
                                    <ListItemButton sx={{ width: '180px' }}>
                                        <ListItemText primary={`${(index + 1)}`} />
                                        <ListItemText primary={`${formatTime(track.createdAt)}`} />
                                    </ListItemButton>
                                </ListItem>
                            );

                        })
                    }

                </List>
            </div>
            <button
                style={{
                    opacity: showDrawer ? '1' : '0',
                    display: showDrawer ? 'flex' : 'none',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    position: 'absolute',
                    zIndex: '999',
                    right: '210px',
                    top: '250px',
                    width: '16px',
                    height: '32px',
                    border: 'solid #ddd 1px',
                    borderRadius: '8px 0px 0px 8px',
                }}
                onClick={() => { setShowDrawer(false); }}>
                <NavigateNextIcon />
            </button>
            <button
                style={{
                    opacity: showDrawer ? '0' : '1',
                    display: showDrawer ? 'none' : 'flex',
                    cursor: 'pointer',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    position: 'absolute',
                    zIndex: '999',
                    right: '14px',
                    top: '250px',
                    width: '16px',
                    height: '32px',
                    border: 'solid #ddd 1px',
                    borderRadius: '8px 0px 0px 8px',
                }}
                onClick={() => { setShowDrawer(true); }} >

                <NavigateBeforeIcon />
            </button>
        </>
    );
}

interface MapDialogProps {
    isOpen: boolean,
    onClose: (value: string) => void,
    visitsCoordinates: { point: number[], name: string, time: string }[],
    tasksCoordinates: { point: number[], name: string }[],
    trackings: UserTrackingModel[],
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose, visitsCoordinates, tasksCoordinates, trackings }) => {

    const [showVisitPath, setShowVisitPath] = useState(true);
    const [showTrackingPath, setShowTrackingPath] = useState(true);

    var [trackingPolylines, setTrackingPolylines] = useState<UserTrackingModel[][]>([]);

    function calculateCenter(): number[] {

        let sumLat = 0;
        let sumLng = 0;

        let filteredTasksPoints = tasksCoordinates.filter((t) => !isNaN(t.point[0])).map(c => c.point);
        let filteredVisitsPoints = visitsCoordinates.filter((t) => !isNaN(t.point[0])).map(c => c.point);

        for (const point of filteredVisitsPoints) {
            sumLat += point[0];
            sumLng += point[1];
        }
        for (const point of filteredTasksPoints) {
            sumLat += point[0];
            sumLng += point[1];
        }
        for (const point of trackings) {
            sumLat += point.latitude ? parseFloat(point.latitude) : 0;
            sumLng += point.longitude ? parseFloat(point.longitude) : 0;
        }

        let sum = (filteredTasksPoints.length + filteredVisitsPoints.length + trackings.filter((c) => c.latitude).length) !== 0 ? (filteredTasksPoints.length + filteredVisitsPoints.length + trackings.filter((c) => c.latitude).length) : 1;
        const avgLat = sumLat / sum;
        const avgLng = sumLng / sum;

        return [avgLat, avgLng];
    }

    const handleClose = () => {
        onClose('selectedValue');
    };

    const firstVisitColorOptions = { color: showVisitPath ? 'blue' : 'rgba(0,0,255,0.2)', }
    const visitColorOptions = { color: showVisitPath ? 'black' : 'rgba(0,0,0,0.2)', }
    const trackingColorOptions = { color: showTrackingPath ? 'black' : 'rgba(0,0,0,0.2)', }
    const taskColorOptions = { color: showVisitPath ? 'orange' : 'rgba(255,165,0,0.2)', }

    const calculateColorGradient = (index: number, total: number) => {
        const ratio = index / total;
        const r = Math.round(255 * ratio);
        const g = Math.round(255 * (1 - ratio));
        const b = 0;
        return `rgba(${r},${g},${b},${showTrackingPath ? 1 : 0.2})`;
    };



    useEffect(() => {
        let polylines: UserTrackingModel[][] = [];
        let poly: UserTrackingModel[] = [];
        for (let index = 0; index < trackings.length - 1; index++) {
            if (poly.length === 2) {
                polylines.push(poly);
                poly = [];
            }
            if (trackings[index].latitude) {
                poly.push(trackings[index]);
                if (trackings[index + 1].latitude) {
                    poly.push(trackings[index + 1]);
                }
            }
            else {
                if (poly.length > 0) {
                    polylines.push(poly);
                    poly = [];
                }
            }
        }

        setTrackingPolylines(polylines);
    }, [isOpen]);

    return (
        <Dialog fullWidth={true} maxWidth='lg' onClose={handleClose} open={isOpen} >
            <MapContainer style={{
                width: '100%',
                height: '500px',
                zIndex: '0'
            }}

                center={ll.latLng(calculateCenter()[0], calculateCenter()[1])} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    visitsCoordinates.map((c, index) => (
                        <CircleMarker center={ll.latLng(c.point[0], c.point[1])}
                            pathOptions={index === 0 ? firstVisitColorOptions : visitColorOptions}
                            radius={5}>
                            <Popup>
                                <div>
                                    {c.name}
                                </div>
                                <div>
                                    {c.time}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))
                }
                {
                    visitsCoordinates.map((c, index) => (
                        <SVGOverlay attributes={{ stroke: 'black', textAlign: 'center', Opacity: showVisitPath ? '1' : '0.2' }} bounds={ll.latLngBounds(ll.latLng(c.point[0] - 0.0002, c.point[1] - 0.0002), ll.latLng(c.point[0] + 0.0002, c.point[1] + 0.0002))}>
                            <circle r="16" cx="50%" cy="50%" fill={showVisitPath ? "white" : 'rgba(255,255,255,0.1)'} />
                            <text x="50%" y="50%" style={{ transform: 'translate(-10%,5%)' }} fontSize={16} stroke={showVisitPath ? "black" : 'rgba(0,0,0,0.1)'} >
                                {index + 1}
                            </text>
                        </SVGOverlay>
                    ))
                }
                {
                    tasksCoordinates.map((c) => {
                        return isNaN(c.point[0]) ? null : (
                            <CircleMarker center={ll.latLng(c.point[0], c.point[1])} pathOptions={taskColorOptions} radius={5}>
                                <Popup>{c.name}</Popup>
                            </CircleMarker>
                        );
                    }
                    )
                }
                <Polyline pathOptions={visitColorOptions} positions={visitsCoordinates.map((c) => ll.latLng(c.point[0], c.point[1]))} />

                {
                    trackings.filter(t => t.latitude).map((c, index) => {
                        return c.latitude ? (
                            <CircleMarker center={ll.latLng(parseFloat(c.latitude!), parseFloat(c.longitude!))}
                                pathOptions={trackingColorOptions} radius={5}>

                            </CircleMarker>
                        ) : null;
                    }
                    )
                }
                {
                    trackings.filter(t => t.latitude).map((c, index) => {
                        return c.latitude ? (
                            <SVGOverlay attributes={{ stroke: 'black', textAlign: 'center' }} bounds={ll.latLngBounds(ll.latLng(parseFloat(c.latitude!) - 0.0002, parseFloat(c.longitude!) - 0.0002), ll.latLng(parseFloat(c.latitude!) + 0.0002, parseFloat(c.longitude!) + 0.0002))}>
                                <circle r="16" cx="50%" cy="50%" fill={showTrackingPath ? "white" : 'rgba(255,255,255,0.1)'} />
                                <text x="50%" y="50%" style={{ transform: 'translate(-10%,5%)', }} fontSize={16} stroke={showTrackingPath ? "black" : 'rgba(0,0,0,0.1)'} >
                                    {index + 1}
                                </text>
                            </SVGOverlay>
                        ) : null;
                    }
                    )
                }
                {
                    trackingPolylines.map((tracking, index) => (<Polyline
                        pathOptions={{ fillColor: calculateColorGradient(index, tracking.length), color: calculateColorGradient(index, trackingPolylines.length), }}
                        positions={tracking.map((c) => ll.latLng(parseFloat(c.latitude!), parseFloat(c.longitude!)))} />))
                }
                <TrackingList trackings={trackings.filter(t => t.latitude)}></TrackingList>

                <div style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    top: "80px",
                    paddingLeft: '8px',
                    border: 'solid #ddd 1px',
                    borderRadius: '8px',
                    left: '8px',
                    zIndex: '999'
                }}>
                    <FormControlLabel control={<Checkbox
                        checked={showVisitPath}
                        onChange={() => { setShowVisitPath(!showVisitPath); }}
                        defaultChecked />} label="Parcours de visite" />
                    <FormControlLabel control={<Checkbox
                        checked={showTrackingPath}
                        onChange={() => { setShowTrackingPath(!showTrackingPath); }}
                        defaultChecked />} label="Trajectoire de défilement" />
                </div>
                <Button color="error" sx={{
                    backgroundColor: 'red',
                    position: 'absolute',
                    minWidth: '32px',
                    height: '32px',
                    padding: '0px',
                    right: '8px',
                    top: "8px",
                    zIndex: '999'
                }}
                    onClick={handleClose}
                    variant="contained" disableElevation
                >
                    <CloseIcon />
                </Button>
            </MapContainer>
        </Dialog>
    );
}

export default MapDialog;