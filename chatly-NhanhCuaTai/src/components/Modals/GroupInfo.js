import React from "react";
import HeaderSub from "../header/HeaderSub";
import styled from "styled-components";
import { useState } from "react";
import GroupInfor from "../thongTinNhom-TrangCaNhan/GroupInfor";

const GroupInfoStyled = styled.div`
    position:absolute;
    right:31px;
    top:83px;
    width: 471px;
    height: 582px;
    border: 1px solid black;
    border-radius: 20px;
    .group_name_members_2 h3{
        font-family: "Roboto", sans-serif;
        font-weight: 700;
        font-size: 25px;
        font-style: normal;
        color: #324b50;
        margin-top: 16px;
    }
    .group_name_members{
        padding-top: 0px;
        padding-bottom: 7px;
        padding-left: 16px;
        padding-right: 40px;
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        height: 91px;
    }
    .group_name_members img{
        width: 91px;
        height: 91px;
        border-radius: 50%;
        border: 2px solid #238c9f;
    }
    .group_name_members_1{
        line-height: 25px;
        padding-left: 0px;
    }
    .group_name_members_1 p{
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 400;
        color: #324b50;
    }
    .group_actions::before{
        content: "";
        width: 471px;
        height: 5px;
        background-color: #dbe3e4;
        position: absolute;
        margin-top: 5px;
    }
    .group_actions h3{
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-size: 20px;
        text-align: left;
        color: #324b50;
        padding-left: 20px;
        padding-top: 20px;
        padding-bottom: 10px;
    }
    .group_actions_1 .pinned_message{
        display: flex;
        justify-content: space-between;
    }
    .pinned_message p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
    }
    .pinned_message i{
        font-size: 24px;
        margin-top: 3px;
    }
    .group_actions_1 i{
        font-size: 24px;
        margin-top: 0px;
    }
    .group_actions ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        margin-top: 0px;
    }
    .group_actions ul{
        padding: 0px 16px;
        margin-bottom: 0px;
    }
    .group_actions_1 .group_members{
        display: flex;
        justify-content: space-between;
    }
    .group_members i{
        font-size: 24px;
        margin-top: 0px;
    }
    .group_members p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
    }
    .group_actions_2 h4{
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-size: 20px;
        text-align: left;
        color: #324b50;
        padding-left: 20px;
        line-height: 0px;
        margin-top: 35px;
        margin-bottom: 25px;
    }
    .group_actions_1 .exit-chat{
        display: flex;
        justify-content: space-between;
    }
    .exit-chat i{
        font-size: 24px;
        margin-top: 0px;
        color: #d33b3b;
    }
    .exit-chat p{
        font-family: "Roboto", sans-serif;
        font-weight: 400;
        font-size: 20px;
        margin-left: 5px;
        margin-top: 0px;
        color: #d33b3b;
    }
    .forward{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
        height: 30px;
        width: 30px;
    }
    .exit-chat{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
    }
    .group_name_members_2{
        display: flex;
        align-items: center;
    }
    .group_name_members_2 i{
        padding-left: 8px;
        font-size: 24px;
    }
    .edit_name{
        border: none;
        background: none;
        cursor: pointer;
        position: relative;
    }
    .group_actions_2::before{
        content: "";
        width: 471px;
        height: 5px;
        background-color: #dbe3e4;
        position: absolute;
    }
    .group_actions_2 ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
    }
    .group_actions_2 ul{
        padding: 0px 16px;
    }
    .group_actions_2{
        padding-top: 5px;
        position: relative;
    }
`

const GroupInfo = ({ onHide }) => {
  const [showGroupInfor, setShowGroupInfor] = useState(false);

  const handleShowGroupInfor = () => {
    setShowGroupInfor(true);
  };

  const handleHideGroupInfor = () => {
    setShowGroupInfor(false);
  };
  
    return (
      <GroupInfoStyled>
        <HeaderSub/>
        <div className="group_name_members">
          <img src="https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5" alt="" />
          <div className="group_name_members_1">
            <div className="group_name_members_2">
              <h3>Nhóm 1 Widosoft</h3>
              <button className="edit_name">
                <i className="bx bxs-edit-alt" />
              </button>
            </div>
            <p>Bao gồm Tài, Đạt và 2 người khác</p>
          </div>
        </div>
        <div className="group_actions">
          <h3>Thông tin về đoạn chat</h3>
          <ul>
            <li className="group_actions_1">
              <div className="pinned_message">
                <i className="bx bx-pin" />
                <p>Xem tin nhắn đã ghim</p>
              </div>
              <button className="forward">
                <i className="bx bx-right-arrow-alt" />
              </button>
            </li>
            <li className="group_actions_1">
              <div className="group_members">
                <i className="bx bx-search-alt" />
                <p onClick={handleShowGroupInfor}>Xem thành viên trong đoạn chat</p>
              </div>
              <button className="forward">
                <i className="bx bx-right-arrow-alt" />
              </button>
            </li>
          </ul>
        </div>
        <div className="group_actions_2">
          <h4>Quyền riêng tư và hỗ trợ</h4>
          <ul>
            <li className="group_actions_1">
              <button className="exit-chat">
                <i className="bx bx-exit" />
                <p>Rời khỏi đoạn chat</p>
              </button>
            </li>
          </ul>
        </div>
        {showGroupInfor && (
        <GroupInfor listMember={[]} onHide={handleHideGroupInfor} />
      )}
      <button onClick={onHide}>Thoát</button>
      </GroupInfoStyled>
    );
  }

  export default GroupInfo;