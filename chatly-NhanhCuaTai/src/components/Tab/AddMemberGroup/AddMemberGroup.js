import { Form } from "antd";
import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import ListAddConditon from "./ListAddConditon";
import addMembersToGroup from "../../lib/addMembersToGroup";
import getGroupMembers from "../../lib/getGroupMembers";
import HeaderSub from "../../header/HeaderSub";


export const TabStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 2px solid black;
    border-radius: 20px;
    
    .bodyTab{
        padding: 0px 16px;
        position: relative;
    }
    .titleText{
        margin: 0px;
        text-align: center;
        font-size: 25px;
        font-weight: 700;
        margin: 5px auto;
        font-family: "Roboto", sans-serif;
        color: #324B50;
    }
    .searchBar{
        border: 1px solid #324B50;
        display: flex;
        height: 30px;
        border-radius: 30px;
        align-items: center;
        padding: 0px 10px;
    }
    .searchBar i{
        font-size: 18px;
    }
    .searchInput{
        width: 100%;
        outline: none;
        border: none;
        color: #324B50;
        opacity: 0.5;
        position: relative;
        font-size: 10px;
    }
    .bodyTab::before{
        content: "";
        background-color: #DBE3E4;
        width: 100%;
        height: 5px;
        top: 90px;
        left: 0;
        position: absolute;
    }
    .addBtn{
        background-color: #324B50;
        padding: 6px 75px;
        border-radius: 10px;
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: white;
        margin: 20px 0;
        cursor: pointer;
    }
`;



export default function AddMemberGroup(){

    //lấy mảng selectusers 
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupId, setGroupId] = useState("OuZyRAcfT09JSm9nmRpQ"); // Giá trị ban đầu của groupId
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        // Thực hiện truy vấn và cập nhật danh sách thành viên của nhóm
        // lấy ra danh sách thành viên có trong nhóm
        const fetchGroupMembers = async () => {
          const members = await getGroupMembers(groupId);
          setGroupMembers(members);
        };
    
        fetchGroupMembers();
      }, [groupId]);

      const handleSelectedUsers = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
      };
    
       
      
      const handleClick = () => {
        // Thực hiện việc thêm thành viên vào nhóm
        addMembersToGroup(groupId, selectedUsers)
      };

    return(
            <TabStyled>
                <Form>
                    <HeaderSub/>
                    <div className="bodyTab">
                        <div className="title">
                            <h3 className="titleText">Thêm thành viên</h3>
                            <div className="searchBar">
                                <i class='bx bx-search-alt icon' style = {{fontSize:"18px", color: "#324B50"}}></i>
                                <input className="searchInput" placeholder ="Tên người dùng"></input>
                            </div>
                        </div>
                        <ListAddConditon
                            groupId={groupId}
                            groupMembers={groupMembers}
                            onSelectUsers={handleSelectedUsers}
                        />
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <button className="addBtn" onClick={handleClick}>Thêm</button>
                    </div>
                </Form>
            </TabStyled>
    )
}