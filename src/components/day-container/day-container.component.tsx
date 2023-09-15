import React, { Component } from 'react';

interface DayContainerProps {
  num: string;
  day: string;
  isSelected: boolean;
  onPressed: () => void;
}


const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';


class DayContainer extends Component<DayContainerProps> {
  render() {
    
    return (
      <div onClick={this.props.onPressed}>
      <div
        style={{
          width: 40,
          height: 40,
          padding: 8,
          margin: '8px 4px 0',
          borderRadius: 4,
          border: '#ccc solid 1px',
          backgroundColor: this.props.isSelected ? 'teal' : 'rgba(255, 255, 255, 1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: this.props.isSelected ? 'white' : 'teal',
          fontWeight: this.props.isSelected ? 'bold' : 'normal',
          fontSize: 17,
          cursor: 'pointer',
          transition:'all 250ms ease',
          
        }}
      >
        {this.props.num}
      </div>
      <div
        style={{
          textAlign: 'center',
          fontSize: 13,
          fontWeight: this.props.isSelected ? 'bold' : 'normal',
          color:  'black',
          transition:'all 250ms ease'
        }}
      >
        {this.props.day.endsWith('.')
          ? this.props.day.substring(0, this.props.day.length - 1).toUpperCase()
          : this.props.day.toUpperCase()}
      </div>
    </div>
    );
  }
}

export default DayContainer;
