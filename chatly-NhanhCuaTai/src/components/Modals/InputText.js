import { useState } from 'react';
import styled from 'styled-components';

const InputTextStyled = styled.div`
  .input-group{
    outline: none;
    border: none;
    font-family: "Roboto", sans-serif;
    font-size: 15px;
    font-weight: 300;
    color: #324b50;
    opacity: 0.5;
    position: relative;
    width: 87%;
  }
`

var nameGroup;
export default function InputText() {
    const [name, setName] = useState("");
  
    nameGroup = name;
    return (
      <InputTextStyled>
        <form>
          <input 
            type="text" 
            placeholder='Nhập tên nhóm'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input-group'
          />
        </form>
      </InputTextStyled>
    )
  }
  export {nameGroup};