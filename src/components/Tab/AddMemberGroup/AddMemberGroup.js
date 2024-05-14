import { Form } from "antd";
import React from "react";
import styled from 'styled-components';
import TabHeader from "../Components/TabHeader";
import ListAdd from "./ListAdd";


const TabStyled = styled.div`
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
    .searchInput{
        width: 100%;
        outline: none;
        border: none;
        color: #324B50;
        opacity: 0.5;
        position: relative;
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
    return(
        <div>
            <TabStyled>
                <Form>
                    <TabHeader/>
                    <div className="bodyTab">
                        <div className="title">
                            <h3 className="titleText">Thêm thành viên</h3>
                            <div className="searchBar">
                                <i class='bx bx-search-alt icon' style = {{fontSize:"18px", color: "#324B50"}}></i>
                                <input className="searchInput" placeholder ="Tên người dùng"></input>
                            </div>
                        </div>
                    <ListAdd/>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <button className="addBtn">
                            Thêm
                        </button>
                    </div>
                </Form>
            </TabStyled>
        </div>
    )
}