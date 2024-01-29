import React, { useState } from 'react';
import { DotSpinner } from '@uiball/loaders'
import VisitModel from '../../models/visit.model';
import ScalableTable from '../scalable-table/scalable-table.component';
import { formatDateToYYYYMMDD } from '../../functions/date-format';
import Button from '@mui/material/Button';

interface VisitTableProps {
    data: VisitModel[];
    isLoading: boolean;
    isDoctor?: boolean;
    id?: string;
    displayReport: (visit: VisitModel) => {};
    displayCommand?: (visit: VisitModel) => {};
}

const VisitTable: React.FC<VisitTableProps> = ({ data, id, isLoading, displayReport, displayCommand, isDoctor }) => {

    return (
        <div id={id}
            style={{
                borderRadius: '8px',
                height: 'calc( 100% - 64px )',
                paddingBottom: '8px'
            }}>
            {
                isLoading ? (<div style={{
                    width: '100%',
                    flexGrow: '1',
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <DotSpinner
                        size={40}
                        speed={0.9}
                        color="black"
                    />
                </div>) :
                    (<ScalableTable

                        rows={
                            [...data.map((row) => {
                                return {
                                    id: row.id,
                                    date: formatDateToYYYYMMDD(row.createdDate!),
                                    delegate: row.user?.username,
                                    model: row,
                                };
                            })]}

                        columns={[
                            {
                                field: 'date',
                                headerName: 'Visites',
                                renderCell(params) {
                                    return (
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-around'
                                        }}>
                                            <div style={{
                                                textAlign: 'start'
                                            }}>
                                                {params.row.date}
                                                <br></br>
                                                {params.row.delegate}
                                            </div>
                                            <Button onClick={() => {
                                                displayReport(params.row.model);
                                            }} variant="contained">R</Button>
                                            {
                                                isDoctor ? null : (<Button disabled={!params.row.model.hasCommand} onClick={() => {
                                                    displayCommand!(params.row.model);
                                                }} variant="outlined">BC</Button>)
                                            }

                                        </div>
                                    );
                                }
                            }
                        ]}

                        hidePaginationFooter={true}

                    />)}
        </div>
    );
};

export default VisitTable;
