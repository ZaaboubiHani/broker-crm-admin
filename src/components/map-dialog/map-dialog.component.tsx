
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup } from 'react-leaflet'
import * as ll from "leaflet";
import "leaflet/dist/leaflet.css"
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';

interface MapDialogProps {
    isOpen: boolean,
    onClose: (value: string) => void,
    visitsCoordinates: { point: number[], name: string }[],
    tasksCoordinates: { point: number[], name: string }[],
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose, visitsCoordinates, tasksCoordinates }) => {
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

        let sum = (filteredTasksPoints.length + filteredVisitsPoints.length) !== 0 ? (filteredTasksPoints.length + filteredVisitsPoints.length) : 1;
        const avgLat = sumLat / sum;
        const avgLng = sumLng / sum;

        return [avgLat, avgLng];
    }


    const handleClose = () => {
        onClose('selectedValue');
    };

    const firstVisitColorOptions = { color: 'blue', }
    const visitColorOptions = { color: 'lime', }
    const taskColorOptions = { color: 'orange', }

    return (
        <Dialog fullWidth={true} maxWidth='lg' onClose={handleClose} open={isOpen} >
            <MapContainer style={{
                width: '100%',
                height: '500px',
                zIndex: '0'
            }}
                center={ll.latLng(calculateCenter()[0], calculateCenter()[1])} zoom={13} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    visitsCoordinates.map((c, index) => (
                        <CircleMarker center={ll.latLng(c.point[0], c.point[1])}
                            pathOptions={index === 0 ? firstVisitColorOptions : visitColorOptions}
                            radius={15}>
                            <Popup>{c.name}</Popup>
                        </CircleMarker>
                    ))
                }
                {
                    tasksCoordinates.map((c) => {
                        return isNaN(c.point[0]) ? null : (
                            <CircleMarker center={ll.latLng(c.point[0], c.point[1])} pathOptions={taskColorOptions} radius={15}>
                                <Popup>{c.name}</Popup>
                            </CircleMarker>
                        );
                    }
                    )
                }
                <Polyline pathOptions={visitColorOptions} positions={visitsCoordinates.map((c) => ll.latLng(c.point[0], c.point[1]))} />
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

export default MapDialog;