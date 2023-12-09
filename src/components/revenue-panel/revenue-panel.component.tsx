import React, { useState } from 'react';
import { DotSpinner } from '@uiball/loaders';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

interface RevenuePanelProps {
    showData: boolean;
    total: number;
    totalHonored: number;
    totalNotHonored: number;
    wilayasRevenue: { wilaya: string, total: number, percentage: number }[];
    productsRevenue: { product: string, quantity: number, total: number, percentage: number }[];
}

const RevenuePanel: React.FC<RevenuePanelProps> = ({ showData, total, totalHonored, totalNotHonored, wilayasRevenue, productsRevenue }) => {
    if (showData) {
        return (
            <div style={{ margin: '16px', flexGrow: '1' }}>
                <div>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>total : {total.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>total honore : {totalHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>total non honore : {totalNotHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                </div>
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h6 style={{ fontSize: 15, fontWeight: '600' }}>vente par produit:</h6>
                <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', border: '1px solid teal' }} component={Paper}>
                    <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                        <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                            <TableRow>
                                <TableCell sx={{ width: '25%' }}>wilaya</TableCell>
                                <TableCell sx={{ width: '25%' }} align="left">quantite</TableCell>
                                <TableCell sx={{ width: '25%' }} align="left">total</TableCell>
                                <TableCell sx={{ width: '25%' }} align="left">percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                            {

                                productsRevenue.map((row, index) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >

                                        <TableCell sx={{ width: '27%' }} align="left">{row.product}</TableCell>
                                        <TableCell sx={{ width: '27%' }} align="left">{row.quantity}</TableCell>
                                        <TableCell sx={{ width: '27%' }} align="left">{row.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                        <TableCell sx={{ width: '27%' }} align="left">{row.percentage}</TableCell>

                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h6 style={{ fontSize: 15, fontWeight: '600' }}>vente par wilaya:</h6>
                <TableContainer sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', borderRadius: '8px', margin: '8px', overflow: 'hidden', border: '1px solid teal' }} component={Paper}>
                    <Table sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0px', width: "100%" }} size="small" aria-label="a dense table">
                        <TableHead sx={{ height: '45px', marginBottom: '16px' }}>
                            <TableRow>
                                <TableCell sx={{ width: '34%' }}>wilaya</TableCell>
                                <TableCell sx={{ width: '34%' }} align="left">total</TableCell>
                                <TableCell sx={{ width: '34%' }} align="left">percentage</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ flexGrow: '1', overflowY: 'auto', overflowX: 'hidden', }}>
                            {
                                wilayasRevenue.map((row, index) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell sx={{ width: '40%' }} align="left">{row.wilaya}</TableCell>
                                        <TableCell sx={{ width: '40%' }} align="left">{row.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</TableCell>
                                        <TableCell sx={{ width: '40%' }} align="left">{row.percentage}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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


export default RevenuePanel;