import React from 'react'
import styled from 'styled-components'
import Header from './Header'
import ListAdd from '../Tab/AddMemberGroup/ListAdd'

const AddGroupStyled = styled.div`
    width: 471px;
    height: 582px;
    border: 1px solid black;
    border-radius: 20px;
    
    .group-info h3{
        text-align: center;
        font-family: "Roboto", sans-serif;
        font-weight: 700;
        font-style: normal;
        font-size: 25px;
        margin: 5px;
        color: #324b50;
    }
    .search_bar {
        border: 1px solid #324B50;
        display: flex;
        height: 30px;
        border-radius: 30px;
        align-items: center;
        padding: 0px 10px;
        margin: 0 16px;
        position: relative;
    }
    .search_bar i{
        font-size: 10px;
    }
    .in-search {
        width: 100%;
        outline: none;
        border: none;
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        font-size: 15px;
        border: none;
        color: #324B50;
        opacity: 0.5;
        position: relative;
    }
    .group_name img{
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 2px solid #238c9f;
    }
    .group_name{
        padding: 0 16px;
        align-items: center;
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
    }
    .input_group{
        outline: none;
        border: none;
        font-family: "Roboto", sans-serif;
        font-size: 15px;
        font-weight: 300;
        color: #324b50;
        opacity: 0.5;
        position: relative;
        width: 87%;
        border-bottom: 1px solid #238C9F;
    }
    p{
        display: flex;
        margin: 0;
        padding: 0 16px;
        font-family: "Roboto", sans-serif;
        color: #324B50;
        font-size: 20px;
        font-weight: 600;
    }
    .create-group{
        background-color: #324B50;
        padding: 6px 75px;
        border-radius: 10px;
        font-family: "Roboto", sans-serif;
        font-sỉze: 20px;
        font-weight: 700;
        color: white;
        margin: 0;
        cursor: pointer;
    }
    .users-list ul{
        padding: 0px 16px;
        height: 270px;
        overflow-y: auto;
        margin-top: 10px;
    }
`
export default function AddGroup(){
    return (
        <AddGroupStyled>
            <Header/>
            <div className='group-info'>
                <h3>Tạo nhóm</h3>
                <div className='group_name'>
                    <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                    <input className='input_group' type='text' placeholder='Nhập tên nhóm'/>
                </div>
                <div className='search_bar'>
                    <i className='bx bx-search-alt' style = {{fontSize: '18px', color: "#324B50"}}></i>
                    <input type='text' className='in-search' placeholder='Tên người dùng...'/>
                </div>
            </div>
            <div style={{width: '100%', height: '5px', backgroundColor: '#DBE3E4', margin: '25px 0 0 0'}}></div>
            <div className='users-list'>
                <p>Gợi ý</p>
                <ListAdd/>
            </div>
            <div style={{display: "flex", justifyContent: "center"}}>
                <button className='create-group'>Tạo nhóm</button>
            </div>
        </AddGroupStyled>
    )
}