import UserInfo from '../list/chatList/chatList';
import ChatList from '../list/userInfo/userInfo';
import '../list/list.css'
const List = () => {
    return(
        <div className='list'>
            <ChatList />
            <UserInfo />
        </div>
    )
}

export default List;