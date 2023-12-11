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
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

interface RevenuePanelProps {
    showData: boolean;
    total: number;
    totalHonored: number;
    totalNotHonored: number;
    wilayasRevenue: { wilaya: string, total: number, percentage: number }[];
    productsRevenue: { product: string, quantity: number, total: number, percentage: number }[];
}

const RevenuePanel: React.FC<RevenuePanelProps> = ({ showData, total, totalHonored, totalNotHonored, wilayasRevenue, productsRevenue }) => {

    const productsColumns: GridColDef[] = [
        { field: 'product', headerName: 'Produit', width: 100 },
        {
            field: 'quantity', headerName: 'Quantité', width: 100,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'total', headerName: 'Total', width: 150,
            align: 'center',
            headerAlign: 'center'
        },
        {
            field: 'percentage', headerName: 'Pourcentage', width: 100,
            align: 'right',
            headerAlign: 'right'
        },
    ];

    const wilayasColumns: GridColDef[] = [
        {
            field: 'wilaya',
            headerName: 'Wilaya',
            width: 150
        },
        {
            field: 'total',
            headerName: 'Total',
            width: 150,
            align: 'center',
            headerAlign: 'center',
        },
        {
            field: 'percentage',
            headerName: 'Pourcentage',
            width: 150,
            align: 'right',
            headerAlign: 'right',
        },
    ];


    if (showData) {
        return (
            <div style={{ margin: '16px', flexGrow: '1' }}>
                <div>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>Total : {total.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>Total honore : {totalHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                    <h6 style={{ fontSize: 15, fontWeight: '600' }}>Total non honore : {totalNotHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                </div>
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h6 style={{ fontSize: 15, fontWeight: '600' }}>Vente par produit:</h6>
                <DataGrid
                    sx={{
                        flexGrow: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid teal'
                    }}
                    rows={
                        [...productsRevenue.map((row, index) => {
                            return {
                                id: index,
                                product: row.product,
                                quantity: row.quantity,
                                total: row.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0)?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),
                                percentage: row.percentage,

                            };
                        })]}
                    columns={productsColumns}
                    hideFooterPagination={true}
                    hideFooter={true}
                    checkboxSelection={false}
                />
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h6 style={{ fontSize: 15, fontWeight: '600' }}>Vente par wilaya:</h6>
                <DataGrid
                    sx={{
                        flexGrow: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid teal'
                    }}
                    rows={
                        [...wilayasRevenue.map((row, index) => {

                            return {
                                id: index,
                                wilaya: row.wilaya,
                                total: row.total?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }) ?? (0)?.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' }),
                                percentage: row.percentage,

                            };
                        })]}
                    columns={wilayasColumns}
                    hideFooterPagination={true}
                    hideFooter={true}
                    checkboxSelection={false}
                />
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