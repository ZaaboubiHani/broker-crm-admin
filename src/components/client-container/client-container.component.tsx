import React, { Component } from 'react';

interface ClientContainerProps {
  name: string;
  isSelected: boolean;
  onPressed: () => void;
}


const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';


class ClientContainer extends Component<ClientContainerProps> {
  render() {
    
    return (
      <div onClick={this.props.onPressed}>
      <div
        style={{
          width: 'max-content',
          height: 40,
          padding: 8,
          margin: '8px 4px 0px 0px',
          borderRadius: 8,
          backgroundColor: this.props.isSelected ? kTernary : 'rgba(255, 255, 255, 1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: this.props.isSelected ? 'white' : kSecondary,
          fontWeight: this.props.isSelected ? 'bold' : 'normal',
          fontSize: 20,
          cursor: 'pointer',
        }}
      >
        {this.props.name}
      </div>
    
    </div>
    );
  }
}

export default ClientContainer;
