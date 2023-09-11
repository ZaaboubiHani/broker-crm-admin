import React, { Component } from 'react';

interface UserContainerProps {
  name: string;
  isSelected: boolean;
  onPressed: () => void;
}


const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';


class UserContainer extends Component<UserContainerProps> {
  render() {
    
    return (
      <div onClick={this.props.onPressed}>
      <div
        style={{
          width: 'max-content',
          height: 40,
          padding: 8,
          margin: '8px 4px 0',
          border: '#ccc solid 1px',
          borderRadius: 4,
          backgroundColor: this.props.isSelected ? kTernary : 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: this.props.isSelected ? 'white' : kSecondary,
          fontWeight: 'bold',
          fontSize: 20,
          cursor: 'pointer',
          transition:'all 250ms ease'
        }}
      >
        {this.props.name}
      </div>
    
    </div>
    );
  }
}

export default UserContainer;
