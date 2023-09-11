import React, { useState } from 'react';
import ReportModel from '../../models/report.model';
import { ClientType } from '../../models/client.model';
import InventoryIcon from '@mui/icons-material/Inventory';
import Divider from '@mui/material/Divider';
import CommentIcon from '@mui/icons-material/Comment';
import HailIcon from '@mui/icons-material/Hail';
import FlagIcon from '@mui/icons-material/Flag';
import EditNoteIcon from '@mui/icons-material/EditNote';


interface ReportPanelProps {
    report?: ReportModel;
    clientType?: ClientType;
}

const ReportPanel: React.FC<ReportPanelProps> = ({ report, clientType }) => {
    if (report) {
        return (
            <div style={{ margin: '16px', flexGrow: '1' }}>

                <h4 style={{ fontSize: 17 }}><InventoryIcon style={{ fontSize: 17 }} /> Produits:</h4>
                {
                    report.products?.map((product) => (
                        <div style={{ display: 'flex', justifyContent: 'space-around', }}>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.name}</h6>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.quantity}</h6>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.rotations}/mois</h6>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{coproduct.name}</h6>
                                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{coproduct.quantity}</h6>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
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
                <h6 style={{ fontSize: 15, fontWeight: '400' }}>{report.note}</h6>
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