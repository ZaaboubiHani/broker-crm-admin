
import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup, Polyline } from 'react-leaflet'
import * as ll from "leaflet";

interface MapDialogProps {

}

const MapDialog: React.FC<MapDialogProps> = () => {
    const position = [51.505, -0.09]
    const limeOptions = { color: 'lime' }

    const polyline = [
        [51.505, -0.09],
        [51.51, -0.1],
        [51.51, -0.12],
    ]

    const multiPolyline = [
        [
            [51.5, -0.1],
            [51.5, -0.12],
            [51.52, -0.12],
        ],
        [
            [51.5, -0.05],
            [51.5, -0.06],
            [51.52, -0.06],
        ],
    ]

    return (
        <MapContainer center={ll.latLng(position[0], position[1])} zoom={9} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline pathOptions={limeOptions} positions={polyline.map((p) => ll.latLng(p[0], p[1]))} />
            <Polyline pathOptions={limeOptions} positions={multiPolyline.map((poly) => poly.map((p) => ll.latLng(p[0], p[1])))} />
        </MapContainer>

    );

}

export default MapDialog;