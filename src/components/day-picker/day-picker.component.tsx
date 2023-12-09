import React, { Component } from 'react';
import DayContainer from '../day-container/day-container.component';
import '../day-picker/day-picker.style.css';
interface DayPickerProps {
    onSelect: (selectedDate: Date) => void;
    padding?: string | number;
    initialDate: Date;
}

class DayPicker extends Component<DayPickerProps> {
    _selectedIndex: number = 0;
    _scrollController: React.RefObject<HTMLDivElement> = React.createRef();
    now: Date = new Date();
    dates: Date[] = [];
    constructor(props: DayPickerProps) {
        super(props);
        this.now = this.props.initialDate
        this._selectedIndex = this.now.getDate() - 1;
        this._scrollController = React.createRef();
        this.dates = [];
    }

    componentDidMount() {
        const scrollOffset = this._selectedIndex > 0
            ? this._selectedIndex * 65 - 65
            : this._selectedIndex * 65;

        if (this._scrollController.current) {
            this._scrollController.current.scrollLeft = scrollOffset;
        }
    }


    render() {
        const currentDate: Date = this.props.initialDate;
        const year: number = currentDate.getFullYear();
        const month: number = currentDate.getMonth();
        this.dates = [];
        const firstDayOfNextMonth: Date = new Date(year, month + 1, 1);

        const lastDayOfCurrentMonth: Date = new Date(firstDayOfNextMonth.getTime() - 1);

        const numberOfDaysInCurrentMonth: number = lastDayOfCurrentMonth.getDate();
        return (

            <div

                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    width: '100px',
                    flexGrow: '1',
                    height: '70px',
                    overflowY: 'hidden',
                    padding: this.props.padding,
                    transition: 'all 300ms ease',
                }}
                ref={this._scrollController}
                className='day-picker'
                onWheel={(event) => {
                    if (this._scrollController.current) {
                        this._scrollController.current.scrollLeft += event.deltaY;
                        this._scrollController.current.classList.add('smooth-scrolling');
                        setTimeout(() => {
                            if (this._scrollController.current) {
                                this._scrollController.current.classList.remove('smooth-scrolling');
                            }
                        }, 300);
                    }
                }}

            >
                {
                    Array.from({ length: numberOfDaysInCurrentMonth }, (_, index) => {
                        this.now.setDate(index + 1);
                        const day = this.now;
                        const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'short' };
                        this.dates.push(new Date(day.getTime()));
                        return (
                            <DayContainer
                                key={index}
                                isSelected={this._selectedIndex === index}
                                num={(index + 1).toString()}

                                day={day.toLocaleString('fr-FR', dayOptions)}
                                onPressed={() => {
                                    this._selectedIndex = index;
                                    this.props.onSelect(this.dates[index]);
                                    this.forceUpdate();
                                }}
                            />
                        );
                    })}
            </div>
        );
    }
}

export default DayPicker;
