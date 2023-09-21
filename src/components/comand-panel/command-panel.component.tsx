import React, { useState } from 'react';
import CommandModel from '../../models/command.model';
import InventoryIcon from '@mui/icons-material/Inventory';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Divider from '@mui/material/Divider/Divider';
import HailIcon from '@mui/icons-material/Hail';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from '@mui/material/Button/Button';
import jsPDF from 'jspdf';

interface CommandPanelProps {
    command?: CommandModel;
}
const generatePdf = () => {
    const pdf = new jsPDF();

    pdf.text('Hello, this is a sample PDF.', 10, 10);

    pdf.save('example.pdf');
};

const CommandPanel: React.FC<CommandPanelProps> = ({ command }) => {
    if (command) {
        return (
            <div style={{ margin: '8px', flexGrow: '1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between',alignItems:'end' }}>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Statut: {command.isHonored ? 'honoré' : 'non honoré'}</h4>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Total: {command.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h4>
                    <Button onClick={generatePdf} variant="outlined"> <PictureAsPdfIcon />Télécharger PDF</Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Client: {command?.visit?.client?.name}</h4>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Localisation: {command?.visit?.client?.wilaya + ', ' + command?.visit?.client?.commune}</h4>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Téléphone: {command?.visit?.client?.phoneOne}</h4>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Total des vendeurs: {command?.visit?.client?.totalSellers}</h4>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Total post chifa: {command?.visit?.client?.totalPostChifa}</h4>
                    <h4 style={{ fontSize: 15, fontWeight: '400' }}> Potentiel: {command?.visit?.client?.potential === 0 ? 'C' : command?.visit?.client?.potential === 1 ? 'B' : 'A'}</h4>
                </div>

                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h4 style={{ fontSize: 17 }}> <InventoryIcon style={{ fontSize: 17 }} /> Produits:</h4>
                {
                    command.products?.map((product) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>{product.name}</h6>
                            <h6 style={{ fontSize: 15, fontWeight: '400' }}>quantité: {product.quantity}</h6>
                        </div>
                    ))
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17 }}><HailIcon style={{ fontSize: 17 }} />Fournisseurs:</h4>
                            {
                                command.suppliers?.map((supplier) => (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.name}</h6>
                                        <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.wilaya}</h6>
                                        <h6 style={{ fontSize: 15, fontWeight: '400' }}>{supplier.commun}</h6>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17 }}><CardGiftcardIcon style={{ fontSize: 17 }} />Motivations:</h4>
                            {command.motivations?.map((motivation) => (
                                <div style={{ display: 'flex' }}>
                                    <h6 style={{
                                        border: "solid black 1px",
                                        padding: '8px',
                                        borderRadius: '8px',
                                        margin: "4px"
                                    }}
                                    >{motivation.content}</h6>
                                </div>
                            ))
                            }
                        </div>
                    )
                }
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


export default CommandPanel;