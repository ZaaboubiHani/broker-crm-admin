import React, { useState } from 'react';
import CommandModel from '../../models/command.model';
import InventoryIcon from '@mui/icons-material/Inventory';



interface CommandPanelProps {
    command?: CommandModel;
}

const CommandPanel: React.FC<CommandPanelProps> = ({ command }) => {
    if (command) {
        return (
            <div style={{ margin: '8px', flexGrow: '1' }}>
                
                   
              
                <h4> <InventoryIcon /> Produits:</h4>
                {
                    command.products?.map((product) => (
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <h6>{product.name}</h6>
                            <h6>{product.quantity}</h6>
                            <h6>{product.rotations}/mois</h6>
                        </div>
                    ))
                }

                {
                    (
                        <div>
                            <h4>Fournisseurs:</h4>
                            {
                                command.suppliers?.map((supplier) => (
                                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                        <h6>{supplier.name}</h6>
                                        <h6>{supplier.wilaya}</h6>
                                        <h6>{supplier.commun}</h6>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }

                {
                    (
                        <div>
                            <h4>Motivations:</h4>
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