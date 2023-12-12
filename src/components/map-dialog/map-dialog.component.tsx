
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
    coordinates: { point: number[], name: string }[],
}

const MapDialog: React.FC<MapDialogProps> = ({ isOpen, onClose, coordinates }) => {
    function calculateCenter(polyline: number[][]): number[] {
        if (polyline.length === 0) {
            return [];
        }

        let sumLat = 0;
        let sumLng = 0;

        for (const point of polyline) {
            sumLat += point[0];
            sumLng += point[1];
        }

        const avgLat = sumLat / polyline.length;
        const avgLng = sumLng / polyline.length;

        return [avgLat, avgLng];
    }



    const handleClose = () => {
        onClose('selectedValue');
    };



    const colorOptions = { color: 'red', }

    return (
       
            <Dialog fullWidth={true} maxWidth='lg' onClose={handleClose} open={isOpen} >
                <MapContainer style={{
                    width: '100%',
                    height: '500px',
                    zIndex: '0'
                }}
                    center={ll.latLng(calculateCenter(coordinates.map(c => c.point))[0], calculateCenter(coordinates.map(c => c.point))[1])} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        coordinates.map((c) => (
                            <CircleMarker center={ll.latLng(c.point[0], c.point[1])} pathOptions={colorOptions} radius={15}>
                                <Popup>{c.name}</Popup>
                            </CircleMarker>
                        ))
                    }
                    <Polyline pathOptions={colorOptions} positions={coordinates.map((c) => ll.latLng(c.point[0], c.point[1]))} />
                </MapContainer>
                <Button color="error" sx={{
                    backgroundColor: 'red',
                    position: 'absolute',
                    minWidth: '32px',
                    height:'32px',
                    padding:'0px',
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