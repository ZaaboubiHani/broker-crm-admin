import React, { useState } from 'react';
import { BiSolidDownArrow,BiSolidUpArrow } from 'react-icons/bi';

import '../expander/expander.style.css';

interface ExpanderProps {
    title: string;
    children: any;
}

const Expander: React.FC<ExpanderProps> = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpander = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="expander">
            <div className='row-container'>
                <button className="expander-toggle" onClick={toggleExpander}>
                    {title}
                </button>
                {
                    isExpanded ? ( <BiSolidUpArrow onClick={toggleExpander}></BiSolidUpArrow>) : ( <BiSolidDownArrow onClick={toggleExpander}></BiSolidDownArrow>)
                }
            </div>
            {isExpanded && <div className="expander-content">{children}</div>}
        </div>
    );
};

export default Expander;
