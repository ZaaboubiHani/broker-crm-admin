
import React, { useState } from 'react';
import '../circle-avatar/circle-avatar.style.css';


interface CircleAvatarProps {
  name:string,
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ name }) => {
 

  return (
    <div className="circle-avatar">
     {name}
    </div>
  );
};

export default CircleAvatar;
