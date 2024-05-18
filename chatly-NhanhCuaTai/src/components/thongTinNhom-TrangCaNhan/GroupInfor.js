import React  from "react";
import HeaderSub from '../header/HeaderSub';

function GroupInfor(props) {

  const arr = Object.keys(props.member).map(key => props.member[key]);

  return (
    <div className="card m-auto" style={{ width: "28rem", borderRadius: "20px", border: "2px solid #333" }}>
      <HeaderSub/>
      <div className="d-flex justify-content-evenly align-content-center m-3">
        <img src={props.ImgGroup} style={{width: '25%', border: '2px solid #238C9F', 'borderRadius':'100%' }} alt="..." />
        <div className="d-flex flex-column pe-3">
          <h5 className="d-block mb-0 mt-3 me-2" style={{ marginLeft: "8px" }}>{props.groupName}</h5>
          <p className="d-block" style={{ marginLeft: "8px" }}>Đây là nhóm của tôi</p>
        </div>
      </div>
      <div className="m-1" style={{ border: "2px solid #ccc" }}></div>
      <div className="card-body pt-1">
        <div className="row">
          <div className="col-6">
            <h6 className="card-title mb-0" style={{ lineHeight: "36px" }}>Danh sách thành viên</h6>
          </div>
          <div className="col-6">
            <div className="input-group rounded">
              <input type="search" className="form-control rounded-pill" placeholder="Search" aria-label="Search" aria-describedby="search-addon" />
              <span className="input-group-text border-0 rounded-pill" id="search-addon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div className="overflow-auto p-0 bg-body-tertiary" style={{ width: "auto", maxHeight: "300px" }}>
          
          {arr.map(member1 => (
            <div className="d-flex"  key={member1.id}>
              <div className="m-1" style={{ width: "46px", height: "46px" }}><img src={member1.photoURL} style={{ width: "100%" }} alt="..." /></div>
              <div className="m-1 w-75"><h6 style={{ lineHeight: "46px" }}>{member1.displayName}</h6></div>
              <div className="m-3"><a className="link-underline-dark" style={{ width: "10%", cursor: "pointer" }}>...</a></div>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

export default GroupInfor;

