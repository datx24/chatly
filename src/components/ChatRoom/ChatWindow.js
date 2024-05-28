import React, { useContext, useState } from 'react';
import { SelectedGroupContext } from '../contextApi/SelectedGroupContext';
import { HomeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import GroupInfo from '../Modals/GroupInfo';
import ChatRoom from './ChatRoom'
export default function ChatWindow() {
    const { selectedGroup } = useContext(SelectedGroupContext);
    // const [showGroupInfo, setShowGroupInfo] = useState(false);
    const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
    // const handleHomeClick = () => {
      // setShowGroupInfo(true);
    // };
    const handleGroupInfoToggle = () => {
      setIsGroupInfoVisible(!isGroupInfoVisible);
    };
  

  return (
    <div style={{ textAlign: 'right' }}>
       {/* Add the Link component with the destination path */}

        <ChatRoom groupId={'r0NcNwkuEaRFAaozTzO0KXAIEIg2'}/>

        <Button
         type="primary"
         onClick={handleGroupInfoToggle}
        >
          <HomeOutlined /> Home
        </Button>
        {isGroupInfoVisible && <GroupInfo onClose={handleGroupInfoToggle}/>}
    </div>
  );
}