import React, { useState } from 'react';
import { BiSolidDownArrow,BiSolidUpArrow } from 'react-icons/bi';

import '../expander/expander.style.css';

interface ExpanderProps {
    title: string;
    children: any;
    isOpen:boolean;
    toggle:() => void;
}

const Expander: React.FC<ExpanderProps> = ({ title, children ,isOpen,toggle}) => {
    const [isExpanded, setIsExpanded] = useState(isOpen);

    const toggleExpander = () => {
        setIsExpanded(!isExpanded);
        toggle();
    };

    return (
        <div className="expander">
            <div className='row-container'>
                <button className="expander-toggle" onClick={toggleExpander}>
                    {title}
                </button>
                {
                    isExpanded ? ( <BiSolidUpArrow style={{cursor:'pointer'}} onClick={toggleExpander}></BiSolidUpArrow>) : ( <BiSolidDownArrow style={{cursor:'pointer'}} onClick={toggleExpander}></BiSolidDownArrow>)
                }
            </div>
            {isExpanded && <div className="expander-content">{children}</div>}
        </div>
    );
};

export default Expander;
