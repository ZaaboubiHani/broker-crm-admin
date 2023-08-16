import React, { Component } from 'react';
import ClientContainer from '../client-container/client-container.component';
import '../client-picker/client-picker.style.css';
interface ClientPickerProps {
    onSelect: (selectedClient: number) => void;
    padding?: string | number;
    clients: any[];
}

class ClientPicker extends Component<ClientPickerProps> {
    _selectedIndex: number = 0;
    _scrollController: React.RefObject<HTMLDivElement> = React.createRef();
   
    indexes : number[] = [];
    constructor(props: ClientPickerProps) {
        super(props);
        this._scrollController = React.createRef();
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
     
      
        return (

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    overflowX: 'auto',
                    width: '100%',
                    padding: this.props.padding ?? '0 0 0 8px',
                    height: 80,
                }}
                ref={this._scrollController}
                className='client-picker'
            >
                {
                    Array.from({ length: this.props.clients.length }, (_, index) => {
                      
                        return (
                            <ClientContainer
                                key={index}
                                isSelected={this._selectedIndex === index}
                               name='wali serijhgld kadri'

                               
                                onPressed={() => {
                                    this._selectedIndex = index;
                                    this.props.onSelect(index);
                                    this.forceUpdate();
                                }}
                            />
                        );
                    })}
            </div>
        );
    }
}

export default ClientPicker;
