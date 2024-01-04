
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, SVGOverlay } from 'react-leaflet'
import * as ll from "leaflet";
import "leaflet/dist/leaflet.css"
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import UserTrackingModel from '@/src/models/user-tracking.model';


interface PathDialogProps {
    isOpen: boolean,
    onClose: (value: string) => void,
    trackings: UserTrackingModel[],
}

const PathDialog: React.FC<PathDialogProps> = ({ isOpen, onClose, trackings }) => {

    var [trackingPolylines, setTrackingPolylines] = useState<UserTrackingModel[][]>([]);

    function calculateCenter(): number[] {

        let sumLat = 0;
        let sumLng = 0;

        for (const point of trackings) {
            sumLat += point.latitude ? parseFloat(point.latitude) : 0;
            sumLng += point.longitude ? parseFloat(point.longitude) : 0;
        }

        let sum = (trackings.filter((c) => c.latitude).length) !== 0 ? (trackings.filter((c) => c.latitude).length) : 1;
        const avgLat = sumLat / sum;
        const avgLng = sumLng / sum;

        return [avgLat, avgLng];
    }

    const calculateColorGradient = (index: number, total: number) => {
        const ratio = index / total;
        const r = Math.round(255 * ratio);
        const g = Math.round(255 * (1 - ratio));
        const b = 0;
        return `rgb(${r},${g},${b})`;
    };


    const handleClose = () => {
        onClose('selectedValue');
    };

    const trackingColorOptions = { color: 'rgb(0,128,0)', }

    useEffect(() => {
        let polylines: UserTrackingModel[][] = [];
        let poly: UserTrackingModel[] = [];
        for (let index = 0; index < trackings.length-1; index++) {
            if (poly.length === 2) {
                polylines.push(poly);
                poly = [];
            }
            if (trackings[index].latitude) {
                poly.push(trackings[index]);
                if (trackings[index+1].latitude) {
                    poly.push(trackings[index+1]);
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
                center={ll.latLng(calculateCenter()[0], calculateCenter()[1])} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetPath</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    trackings.map((c, index) => {
                        return c.latitude ? (
                            <CircleMarker center={ll.latLng(parseFloat(c.latitude!), parseFloat(c.longitude!))} 
                            pathOptions={{ fillColor: 'black', color:'black' }} radius={10}>

                            </CircleMarker>
                        ) : null;
                    }
                    )
                }
                {
                    trackings.map((c, index) => {
                        return c.latitude ? (
                            <SVGOverlay attributes={{ stroke: 'black', textAlign: 'center' }} bounds={ll.latLngBounds(ll.latLng(parseFloat(c.latitude!) - 0.0002, parseFloat(c.longitude!) - 0.0002), ll.latLng(parseFloat(c.latitude!) + 0.0002, parseFloat(c.longitude!) + 0.0002))}>
                                <circle r="16" cx="50%" cy="50%" fill="white" />
                                <text x="50%" y="50%" style={{ transform: 'translate(-10%,5%)' }} fontSize={16} stroke="black" >
                                    {index + 1}
                                </text>
                            </SVGOverlay>
                        ) : null;
                    }
                    )
                }
                {
                    trackingPolylines.map((tracking,index) => (<Polyline
                        pathOptions={{ fillColor: calculateColorGradient(index,tracking.length), color: calculateColorGradient(index, trackingPolylines.length), }}
                        positions={tracking.map((c) => ll.latLng(parseFloat(c.latitude!), parseFloat(c.longitude!)))} />))
                }
            </MapContainer>
            <Button color="error" sx={{
                backgroundColor: 'red',
                position: 'absolute',
                minWidth: '32px',
                height: '32px',
                padding: '0px',
                right: '8px',
                top: "8px",
                zIndex: '99'
            }}
                onClick={handleClose}
                variant="contained" disableElevation
            >
                <CloseIcon />
            </Button>
        </Dialog>
    );
}

export default PathDialog;