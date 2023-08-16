import React, { Component } from 'react';
import DatePickerBar from '../../components/date-picker/date-picker.component';

interface HomePageProps {
    date: Date;
}

const kPrincipal = '#35d9da';
const kSecondary = '#0A2C3B';
const kTernary = '#3D7C98';

class HomePage extends Component<{}, HomePageProps> {
    constructor({ }) {
        super({});
        this.state = {
            date: new Date()
        }
    }

    handleOnPick = (date: Date): void => {
    }

    render() {
        return (
            <div>
                <DatePickerBar onPick={this.handleOnPick}></DatePickerBar>
            </div>
        );
    }
}

export default HomePage;
