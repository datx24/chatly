import React from 'react';
import TabHeader from '../Tab/Components/TabHeader';

const MyComponent = ({ imgRepresent, nameRepresent, sex, dateBirth, email, numberPhone }) => {
  return (
    <div className="card m-auto" style={{ width: '28rem', borderRadius: '20px', border: '2px solid #333' }}>
      <TabHeader />
      <div className="d-flex justify-content-evenly align-content-center m-2">
        <img src={imgRepresent} className="card-img-top w-auto" alt="..." />
        <h5 className="d-block p-3 mb-0 mt-3">{nameRepresent}</h5>
      </div>
      <div className="m-1" style={{ border: '2px solid #ccc' }}></div>
      <div className="card-body">
        <h5 className="card-title">Thông tin cá nhân của bạn</h5>
        <div className="d-flex justify-content-between">
          <div>Giới tính</div>
          <div>{sex}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div>Ngày sinh</div>
          <div>{dateBirth}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div>Email</div>
          <div>{email}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div>Số điện thoại</div>
          <div>{numberPhone}</div>
        </div>
      </div>
    </div>
  );
};

export default MyComponent;