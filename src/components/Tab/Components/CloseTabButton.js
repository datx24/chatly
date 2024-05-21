import React from 'react';
import styled from 'styled-components';

const CloseTabButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{outline: "none"}} className="closeTab">
      <span>X</span>
    </button>
  );
};

export default CloseTabButton;