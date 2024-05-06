import React from "react";
import styled from 'styled-components'
import { useState } from "react";

const users = [
    {
        "id": 1,
        "user_name": "Hoàng Duy An",
        "img_url": "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/260784313_581589186474586_588251621212950470_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IxzZgheN2UAAb4ww5Mw&_nc_ht=scontent.fdad1-3.fna&oh=00_AfB2o0zaUO385mXo_aw98suAnYddPT6Z4s5gFLTH53UuKw&oe=66337AF9"
    },
    {
        "id": 2,
        "user_name": "Hoàng Duy An",
        "img_url": "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/260784313_581589186474586_588251621212950470_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IxzZgheN2UAAb4ww5Mw&_nc_ht=scontent.fdad1-3.fna&oh=00_AfB2o0zaUO385mXo_aw98suAnYddPT6Z4s5gFLTH53UuKw&oe=66337AF9"
    },
    {
        "id": 3,
        "user_name": "Hoàng Duy An",
        "img_url": "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/260784313_581589186474586_588251621212950470_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IxzZgheN2UAAb4ww5Mw&_nc_ht=scontent.fdad1-3.fna&oh=00_AfB2o0zaUO385mXo_aw98suAnYddPT6Z4s5gFLTH53UuKw&oe=66337AF9"
    },
    {
        "id": 4,
        "user_name": "Hoàng Duy An",
        "img_url": "https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-1/260784313_581589186474586_588251621212950470_n.jpg?stp=dst-jpg_s200x200&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IxzZgheN2UAAb4ww5Mw&_nc_ht=scontent.fdad1-3.fna&oh=00_AfB2o0zaUO385mXo_aw98suAnYddPT6Z4s5gFLTH53UuKw&oe=66337AF9"
    },
]

const ListAddStyled = styled.div`
    font-family: "Roboto", sans-serif;
    color: #324B50;
    font-size: 20px;
    p{
        display: flex;
        margin: 30px 0 0 0;
        font-weight: 600;
    }
    ul{
        padding: 0;
        margin: 0;
        height: 340px;
        overflow-y: auto;
    }ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
        height: 46px;
        margin: 10px 0;
        align-items:center;
    }
    .userImage img{
        height: 46px;
        border-radius: 100%;
        border: 2px solid #238C9F;
    }
    .userChoose{
        display: flex;
    }
    .userName{
        margin: 10px 13px;
    }
`

function UserItem({ user }){
    return(
        <ListAddStyled>
            <div className="userChoose">
                <div className="userImage"><img src={user.photoURL} alt=""/></div>
                <span className="userName">{user.displayName}</span>
            </div>
        </ListAddStyled>
    )
}

export default function ListAdd(){

    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    return(
        <ListAddStyled >
            <p>Gợi ý</p>
            <ul>
                {users.map(user => (
                    <li key = {user.uid}>
                        <UserItem
                            user = {user}
                        />
                        <input type="checkbox"></input>
                    </li>
                ))}
            </ul>
        </ListAddStyled>
            
    )
}