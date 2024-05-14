import React from 'react';

const CloseTabButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="closeTab">
      <span>X</span>
    </button>
  );
};

export default CloseTabButton;