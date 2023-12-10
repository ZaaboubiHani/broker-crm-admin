
import React from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup ,} from 'react-leaflet'
import * as ll from "leaflet";

interface MapDialogProps {

}

const MapDialog: React.FC<MapDialogProps> = () => {
    const position = [51.505, -0.09]

    return (


        <MapContainer center={ll.latLng(position[0],position[1])} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={ll.latLng(position[0],position[1])}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>);

}

export default MapDialog;