import { useState } from 'react';
var nameGroup;
export default function InputText() {
    const [name, setName] = useState("");
  
    nameGroup = name;
    return (
      <form>
       <input 
            type="text" 
            placeholder='Nhập tên nhóm'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
      </form>
    )
  }
  export {nameGroup};