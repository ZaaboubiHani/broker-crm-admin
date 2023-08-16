import React from 'react';
import './button.style.css';



interface ButtonProps {
    onClick: () => void;
    text: string;
    backgroundColor?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, text, backgroundColor }) => {

    return (
        <button style={{ backgroundColor: backgroundColor }} onClick={onClick}>{text}</button>
    );
};

export default Button;
