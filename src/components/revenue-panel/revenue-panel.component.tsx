import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

interface RevenuePanelProps {
    showData: boolean;
    total: number;
    totalHonored: number;
    totalNotHonored: number;
    wilayasRevenue: { wilaya: string, total: number, percentage: number }[];
    productsRevenue: { product: string, quantity: number, total: number, percentage: number }[];
}


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,

        backgroundColor: theme.palette.mode === 'light' ? '#CC38E0' : '#308fe8',
    },
}));


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
            <div style={{ margin: '16px', flexGrow: '1', flex: '1', overflowY: 'auto',height:'96%', overflowX: 'hidden', }}>
                <div style={{
                    display: 'flex'
                }}>
                    <div style={{ marginRight: '8px' }}>
                        <h6 style={{ fontSize: 15, fontWeight: '600', margin: '0px' }}>Total : {total.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                        <h6 style={{ fontSize: 15, fontWeight: '600', margin: '0px' }}>Total honore : {totalHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                        <h6 style={{ fontSize: 15, fontWeight: '600', margin: '0px' }}>Total non honore : {totalNotHonored.toLocaleString('fr-DZ', { style: 'currency', currency: 'DZD' })}</h6>
                    </div>
                    <div style={{
                        width: '50%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{
                            color: '#FC761E',
                            display: 'flex',
                            fontSize: 15,
                            alignItems: 'center'
                        }}>
                            <LinearProgress sx={{ flex: '1', marginRight: '8px' }} color="inherit" variant="determinate" value={100} />
                            100%
                        </div>
                        <div style={{
                            color: '#CC38E0',
                            display: 'flex',
                            fontSize: 15,
                            alignItems: 'center'
                        }}>
                            <LinearProgress sx={{ flex: '1', marginRight: '8px' }} color="inherit" variant="determinate" value={totalHonored / (total === 0 ? 1 : total) * 100} />
                            {(totalHonored / (total === 0 ? 1 : total) * 100).toFixed(0)}%
                        </div>
                        <div style={{
                            color: '#38EB5D',
                            display: 'flex',
                            fontSize: 15,
                            alignItems: 'center'
                        }}>
                            <LinearProgress sx={{ flex: '1', marginRight: '8px' }} color="inherit" variant="determinate" value={totalNotHonored / (total === 0 ? 1 : total) * 100} />
                            {(totalNotHonored / (total === 0 ? 1 : total) * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
                <Divider component="div" style={{ margin: '8px 0px' }} />
                <h6 style={{ fontSize: 15, fontWeight: '600', margin: '0px' }}>Vente par produit:</h6>
                <DataGrid
                    sx={{
                        flexGrow: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid teal',
                        height:'max-content',
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
                <h6 style={{ fontSize: 15, fontWeight: '600', margin: '0px' }}>Vente par wilaya:</h6>
                <DataGrid
                    sx={{
                        flexGrow: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid teal',
                        height:'max-content',
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