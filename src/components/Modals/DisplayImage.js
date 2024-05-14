import React, { useState } from "react";
var img;
const DisplayImage = () => {

const [image, setImage] = useState(null);
  const onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(URL.createObjectURL(img));
    }
  };
  img = image;
  return (
    <div>
      <div>
        <div>
          <img src={img} alt="" />
          
          <input type="file" name="myImage" onChange={onImageChange} />
         
        </div>
      </div>
    </div>
  );
};
export {img};
export default DisplayImage;