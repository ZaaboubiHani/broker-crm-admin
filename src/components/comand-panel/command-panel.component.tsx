import React, { useState } from 'react';
import CommandModel from '../../models/command.model';
import InventoryIcon from '@mui/icons-material/Inventory';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Divider from '@mui/material/Divider/Divider';
import HailIcon from '@mui/icons-material/Hail';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Button from '@mui/material/Button/Button';
import jsPDF from 'jspdf';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import { Card, CardActionArea, CardMedia, DialogActions } from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DrawIcon from '@mui/icons-material/Draw';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

interface CommandPanelProps {
    command?: CommandModel;
    showBackButton?: boolean;
    onBackClick?: () => void;
}

const generatePdf = (command: CommandModel) => {
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    pdf.text(`Statut: ${command.isHonored ? 'honoré' : 'non honoré'}`, 10, 8);
    pdf.text(`Total: ${command.totalRemised},00 DA`, 10, 16);
    pdf.text(`Client: ${command?.visit?.client?.name}`, 10, 24);
    pdf.text(`Localisation: ${command?.visit?.client?.wilaya + ', ' + command?.visit?.client?.commune}`, 10, 32);
    pdf.text(`Téléphone: ${command?.visit?.client?.phoneOne}`, 10, 40);
    pdf.text(`Total des vendeurs: ${command?.visit?.client?.totalSellers}`, 10, 48);
    pdf.text(`Total post chifa: ${command?.visit?.client?.totalPostChifa}`, 10, 56);
    pdf.text(`Potentiel: ${command?.visit?.client?.potential === 0 ? 'C' : command?.visit?.client?.potential === 1 ? 'B' : 'A'}`, 10, 64);
    pdf.text(`Produits:`, 10, 76);
    const productsData: { [key: string]: string; }[] = [];
    command.products?.map(product => productsData.push({ Nom: product.name ?? '', Quantité: `${product.quantity}` ?? '' }));
    pdf.table(10, 80, productsData, [{ name: 'Nom', prompt: 'Nom', align: 'left', padding: 2, width: 100 },
    { name: 'Quantité', prompt: 'Quantité', align: 'left', padding: 2, width: 100 },
    ], {});
    var supplierTitleY = (productsData.length + 1) * 10 + 94;
    pdf.text(`Fournisseurs:`, 10, supplierTitleY);
    const suppliersData: { [key: string]: string; }[] = [];
    command.suppliers?.map(supplier => suppliersData.push({ Nom: supplier.name ?? '', Wilaya: supplier.wilaya ?? '', Commune: supplier.commun ?? '' }));
    pdf.table(10, supplierTitleY + 4, suppliersData, [
        { name: 'Nom', prompt: 'Nom', align: 'left', padding: 2, width: 75 },
        { name: 'Wilaya', prompt: 'Wilaya', align: 'left', padding: 2, width: 75 },
        { name: 'Commune', prompt: 'Commune', align: 'left', padding: 2, width: 75 },
    ], {});
    var motivationTitleY = (suppliersData.length + 1) * 10 + supplierTitleY + 18;
    pdf.text(`Motivation:`, 10, motivationTitleY);
    pdf.setFont("Arial", "bold");
    pdf.text(command.motivations?.map((motivation) => motivation.content ?? '').join(', ') ?? '', 16, motivationTitleY + 4);
    pdf.setFont("Arial", "normal");
    pdf.text(`Remarque:`, 10, motivationTitleY + 12);
    pdf.text(command.note || '', 12, motivationTitleY + 16);
    pdf.text(`signature:`, 160, 240);
    pdf.addImage(command.signature?.url || '', 'JPEG', 150, 250, 35, 35);

    var lineHeight = pdf.getLineHeight() / pdf.internal.scaleFactor;
    pdf.save(`${command?.visit?.client?.name}_${formatDateToYYYYMMDD(new Date())}.pdf`);
};

const CommandPanel: React.FC<CommandPanelProps> = ({ command, showBackButton, onBackClick }) => {
    const handleDownload = (url?: string) => {
        window.open(url, '_blank');
    };
    if (command) {
        return (
            <div style={{ margin: '8px 0px 8px 8px', flexGrow: '1', overflowY: 'scroll', overflowX: 'hidden', paddingRight: '8px', height: '96%' }}>
                <Button style={{
                    display: showBackButton === undefined || showBackButton === false ? 'none' : 'flex',
                    minWidth: '10px',
                    height: '40px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 'none',
                    borderRadius: '50px',
                    marginRight: '8px'
                }}
                    size='small'
                    onClick={onBackClick}
                    variant="outlined">
                    <ArrowBackIosNewIcon style={{ width: '20px', height: '20px', color: 'rgb(0, 182, 182)' }} />
                </Button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Statut: {command.isHonored ? 'honoré' : 'non honoré'}</h4>
                    <Button style={{ margin: 'none' }} onClick={() => generatePdf(command)} variant="outlined"> <PictureAsPdfIcon />Télécharger PDF</Button>
                </div>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Total: {command.totalRemised?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Client: {command?.visit?.client?.name}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Localisation: {command?.visit?.client?.wilaya + ', ' + command?.visit?.client?.commune}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Téléphone: {command?.visit?.client?.phoneOne}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Total des vendeurs: {command?.visit?.client?.totalSellers}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Total post chifa: {command?.visit?.client?.totalPostChifa}</h4>
                <h4 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}> Potentiel: {command?.visit?.client?.potential === 0 ? 'C' : command?.visit?.client?.potential === 1 ? 'B' : 'A'}</h4>
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}> <InventoryIcon style={{ fontSize: 17 }} /> Produits:</h4>
                {
                    command.products?.map((product) => (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h6 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}>{product.name}</h6>
                            <h6 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}>quantité: {product.quantity}</h6>
                        </div>
                    ))
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}><HailIcon style={{ fontSize: 17 }} />Fournisseurs:</h4>
                            {
                                command.suppliers?.map((supplier) => (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h6 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}>{supplier.name}</h6>
                                        <h6 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}>{supplier.wilaya}</h6>
                                        <h6 style={{ fontSize: 15, fontWeight: '400', margin: '0px', height: '32px' }}>{supplier.commun}</h6>
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
                            <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}><CardGiftcardIcon style={{ fontSize: 17 }} />Motivations:</h4>
                            {command.motivations?.map((motivation) => (
                                <div style={{ display: 'flex', margin: '0px', }}>
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
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}><EditNoteIcon style={{ fontSize: 17 }} />Remarque:</h4>
                            {command.note}
                        </div>
                    )
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}><NewspaperIcon style={{ fontSize: 17 }} />Facture:</h4>
                            <Card sx={{ maxWidth: 345, margin: '4px', borderRadius: '4px' }}>
                                <CardActionArea onClick={() => handleDownload(command.invoice?.url)}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={command.invoice?.url}

                                    />
                                </CardActionArea>
                            </Card>
                        </div>
                    )
                }
                <Divider component="div" style={{ margin: '8px 0px' }} />
                {
                    (
                        <div>
                            <h4 style={{ fontSize: 17, margin: '0px', height: '32px' }}><DrawIcon style={{ fontSize: 17 }} />Signature:</h4>
                            <Card sx={{ maxWidth: 345, margin: '4px', borderRadius: '4px' }}>
                                <CardActionArea onClick={() => handleDownload(command.signature?.url)}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={command.signature?.url}

                                    />
                                </CardActionArea>
                            </Card>
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