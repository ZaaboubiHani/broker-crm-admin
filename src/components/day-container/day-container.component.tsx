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


  onHover = false;

  render() {

    return (
      <div onClick={this.props.onPressed}
        onMouseEnter={() => {
          this.onHover = true;
          this.setState({});

        }}
        onMouseLeave={() => {
          this.onHover = false;
          this.setState({});
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            padding: 8,
            margin: '0px 2px',
            borderRadius: 4,
            border: this.onHover ? '#000 solid 1px' : '#ccc solid 1px',
            backgroundColor: this.props.isSelected ? 'teal' : 'rgba(255, 255, 255, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: this.props.isSelected ? 'white' : 'teal',
            fontWeight: this.props.isSelected ? 'bold' : 'normal',
            fontSize: 17,
            cursor: 'pointer',
            transition: 'all 300ms ease',

          }}
        >
          {this.props.num}
        </div>
        <div
          style={{
            textAlign: 'center',
            fontSize: 13,
            fontWeight: this.props.isSelected ? 'bold' : 'normal',
            color: 'black',
            transition: 'all 250ms ease'
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
