import React from 'react'
import styled from 'styled-components'
import Header from './Header'

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
        height: 30px;
        width: 90%;
        border: 1px solid black;
        border-radius: 20px;
        align-items: center;
        justify-content: space-between;
        padding: 0px 16px;
        margin-left: 5px;
    }
    .search_bar i{
        font-size: 10px;
    }
    .in-search{
        width: 90%;
        font-family: "Roboto", sans-serif;
        font-weight: 300;
        font-size: 10px;
        border: none;
    }
    .in-search {
        outline: none;
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
    }
    .search_bar::before{
        content: "";
        width: 371px;
        background-color: #238c9f;
        height: 1px;
        position: absolute;
        top: 120px;
        margin-left: 50px;
    }
    .user .userInfo{
        display: flex;
        justify-content: space-between;
    }
    .userInfo img{
        width: 46px;
        height: 46px;
        border-radius: 50%;
        border: 2px solid #238c9f;
        margin-top: 6px;
    }
    .users-list h4{
        text-align: left;
        font-weight: 500;
        font-size: 20px;
        color: #324b50;
        padding-left: 16px;
        margin-bottom: 0px;
        padding-top: 5px;
        margin-top: 10px;
    }
    .userInfo p{
        font-family: "Roboto", sans-serif;
        font-size: 20px;
        line-height: 23px;
        margin-left: 15px;
    }
    .users-list::before{
        content: "";
        width: 471px;
        height: 5px;
        background-color: #dbe3e4;
        position: absolute;
    }
    .users-list ul li{
        list-style: none;
        display: flex;
        justify-content: space-between;
    }
    .create-group{
        width: 202px;
        height: 34px;
        font-family: "Roboto", sans-serif;
        font-weight: 700;
        color: white;
        font-size: 20px;
        background-color: #324b50;
        cursor: pointer;
        border-radius: 15px;
        margin-left: 134px;
    }
    .radio{
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
                    <input type='file'/>
                    <input className='input_group' type='text' placeholder='Nhập tên nhóm'/>
                </div>
                <div className='search_bar'>
                    <i className='bx bx-search-alt'></i>
                    <input type='text' className='in-search' 
                    placeholder='Tên người dùng...'/>
                </div>
            </div>
            <div className='users-list'>
                <h4>Gợi ý</h4>
                <ul>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Đinh Chí Bảo</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Trần Quốc Bảo</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Dương Thị Ánh Hồng</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Hà Thị Kiều Ngân</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Nguyễn Thanh Nghĩa</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Nguyễn Bùi Quang Huy</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                    <li className='user'>
                        <div className='userInfo'>
                            <img src='https://scontent.xx.fbcdn.net/v/t1.15752-9/435061403_1633465390755241_6587315416376135124_n.png?stp=dst-png_p206x206&_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=bIgKxIwSujoAb6EDXtq&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QH8hJCvdl9wvqIHRx-Jj74NnkiTTj4oEaZYr4vBUao_4A&oe=664EE7E5' alt=''/>
                            <p>Trần Minh Hiếu</p>
                        </div>
                        <input type='radio' className='radio'/>
                    </li>
                </ul>
            </div>
            <button className='create-group'>
                <span>
                    Tạo nhóm
                </span>
            </button>
        </AddGroupStyled>
    )
}