import { Form } from "antd";
import React from "react";
import styled from "styled-components";
import TabHeader from "../Components/TabHeader";
import UserHead from "./UserHead";
import UserInfor from "./UserInfor";

const user = {
    "id": 1,
    "user_name": "Hoàng Duy An",
    "img_url": "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/430809777_403429539078352_3468064935036756044_n.jpg?stp=dst-jpg_p200x200&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=NX5wQu0D4McQ7kNvgHDVK1g&_nc_ht=scontent.fdad1-3.fna&oh=00_AfC3fWx98hZnTnCPHuN_KdaPnO7xKTzAKF_eIhrlYeGptQ&oe=6633A991",
    "gender": "Nam",
    "email": "",
    "phone_number": "",
    "birthday" : "",
}

const TabStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 2px solid black;
    border-radius: 20px;
    .userInfor{
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 500;
        margin: 15px 0 5px 0;
        padding: 0 16px;
        position: relative;
    }
    .userAct{
        text-align: left;
        margin: 25px 16px;
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        font-weight: 500;
    }
    .actItem{
        display: flex;
        align-items: center;
        margin-bottom: 5px;
    }
    .actItem p{
        margin: 0;
    }
`

export default function OtherUser(){
    return(
        <div>
            <TabStyled>
                <Form>
                    <TabHeader/>
                    <UserHead
                        user = {user}
                    />
                    <UserInfor
                        user = {user}
                    />
                    <div className="userAct">
                        <div className="actItem">
                            <i className='bx bx-block'></i>
                            <p>Chặn</p>
                        </div>
                        <div className="actItem">
                            <i className='bx bx-trash-alt' ></i>
                            <p>Xóa khỏi danh sách bạn bè</p>
                        </div>
                    </div>
                </Form>
            </TabStyled>
        </div>
    )
}