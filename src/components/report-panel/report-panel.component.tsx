import React, { useState } from 'react';
import ReportModel from '../../models/report.model';
import { ClientType } from '../../models/client.model';
import InventoryIcon from '@mui/icons-material/Inventory';
import Divider from '@mui/material/Divider';
import CommentIcon from '@mui/icons-material/Comment';
import HailIcon from '@mui/icons-material/Hail';
import FlagIcon from '@mui/icons-material/Flag';
import EditNoteIcon from '@mui/icons-material/EditNote';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Button from '@mui/material/Button/Button';
import CommandModel from '../../models/command.model';
import { formatDateToYYYYMMDD, formatTime } from '../../functions/date-format';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


interface ReportPanelProps {
    report?: ReportModel;
    location?: string;
    showBackButton?: boolean;
    clientType?: ClientType;
    onBackClick?: () => void;
}

const openGoogleMaps = (location?: string) => {
    if (location && location.length > 0) {
        let coordinates = location.split(',');
        const latitude = coordinates[0];
        const longitude = coordinates[1];
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, '_blank');
    }
};


const ReportPanel: React.FC<ReportPanelProps> = ({ report, clientType, location, showBackButton, onBackClick }) => {
    if (report) {
        return (
            <div style={{ margin: '16px', flexGrow: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'start',
                        justifyContent: 'start',
                    }}>
                        <Button style={{
                            display: showBackButton === undefined || showBackButton === false ? 'none' : 'block',
                            width: '30px',
                            height: '35px',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                            onClick={onBackClick}
                            variant="outlined">
                            <ArrowBackIosNewIcon style={{ width: '30px', color: 'rgb(0, 182, 182)', marginBottom: '5px' }} />
                        </Button>
                        <div style={{ display: 'flex', height: '40px', }}>
                            <h6 style={{ marginRight: '16px', }}>Date: {formatDateToYYYYMMDD(report.createdAt!)}</h6>
                            <h6>Heure: {formatTime(report.createdAt!)}</h6>
                        </div>
                    </div>
                    <Button style={{
                        height: '40px',
                        textDecoration: 'none',
                    }} onClick={() => openGoogleMaps(location)} variant="outlined"> <LocationOnIcon />localisation</Button>
                </div>

                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h4 style={{ fontSize: 17 }}><InventoryIcon style={{ fontSize: 17 }} /> Produits:</h4>
                {
                    report.products?.map((product) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.name}</h6>
                            {
                                clientType !== ClientType.doctor ? (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '66%' }}>
                                        <h6 style={{ fontSize: 15, fontWeight: '400' }}>quantité:{product.quantity}</h6>
                                        <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.rotations}/mois</h6>
                                    </div>
                                ) : null
                            }

                        </div>
                    ))
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    clientType !== ClientType.doctor ?
                        (
                            <div>
                                <h4 style={{ fontSize: 17 }}><InventoryIcon style={{ fontSize: 17 }} /> Produits concurrents:</h4>
                                {
                                    report.coproducts?.map((coproduct) => (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{coproduct.name}</h6>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>quantité: {coproduct.quantity}</h6>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{coproduct.rotations}/mois</h6>
                                        </div>
                                    ))
                                }
                                <Divider component="div" style={{ margin: '8px 0px' }} />
                            </div>
                        ) : null
                }
                {
                    clientType !== ClientType.doctor ?
                        (
                            <div>
                                <h4 style={{ fontSize: 17 }}><HailIcon style={{ fontSize: 17 }} /> Fournisseurs:</h4>
                                {
                                    report.suppliers?.map((supplier) => (
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.name}</h6>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.wilaya}</h6>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.commun}</h6>
                                        </div>
                                    ))
                                }
                                <Divider component="div" style={{ margin: '8px 0px' }} />
                            </div>
                        ) : null
                }

                {
                    clientType == ClientType.doctor ?
                        (
                            <div>
                                <h4 style={{ fontSize: 17 }}><CommentIcon style={{ fontSize: 17 }} /> Commentaires:</h4>
                                {report.comments?.map((comment) => (
                                    <div style={{ display: 'flex' }}>
                                        <h6 style={{
                                            fontSize: 15,
                                            fontWeight: '400',
                                            border: "solid black 1px",
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            margin: "4px"
                                        }}
                                        >{comment.comment}</h6>
                                    </div>
                                ))
                                }
                                <Divider component="div" style={{ margin: '8px 0px' }} />
                            </div>
                        )
                        : null
                }

                {
                    clientType == ClientType.doctor ? (
                        <div>
                            <h4 style={{ fontSize: 17 }}><FlagIcon style={{ fontSize: 17 }} /> Objectif:</h4>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{report.objectif}</h6>
                            <Divider component="div" style={{ margin: '8px 0px' }} />
                        </div>
                    )
                        : null
                }
                <h4 style={{ fontSize: 17 }}><EditNoteIcon style={{ fontSize: 17 }} /> Remarque:</h4>
                <h6 style={{
                    fontSize: 15, fontWeight: '400',
                    width: '360px',
                    flex: '1',
                    overflowWrap: 'break-word',
                    overflow: 'hidden'
                }}>{report.note}</h6>
            </div>
        );
    } else {
        return (
            <div style={
                {
                    width: '100%',
                    height: "100%",
                    display: 'grid',
                    placeItems: 'center',
                }
            }>
                Cliquez sur voir pour afficher les détails
            </div>
        )
    }
}


export default ReportPanel;