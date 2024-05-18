import UserInfo from './userInfo/userInfo'
// import ChatList from '../list/userInfo/userInfo';
import ChatList from '../list/chatList/chatList';
import '../list/list.css'
const List = () => {
    return(
        <div className='list'>
            <ChatList />
            <UserInfo/>
        </div>
    )
}
export default List;