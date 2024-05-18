import React, { useState, useEffect } from 'react';
import { Avatar, Button, Collapse, Typography } from 'antd';
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons';
import AddGroup from '../Modals/AddGroup';
import { useUserStore } from '../lib/userStore';
import roomJoined from './RoomJoined';
import { db } from "../lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { groupId } from '../lib/groups';

const { Panel } = Collapse;

const PanelStyle = styled(Panel)`
  &&& {
    .ant-collapse-header,
    p {
      color: white;
    }
    .ant-collapse-content-box {
      padding: 0 40px;
    }
    .add-room {
      color: white;
      padding: 0;
    }
  }
`;

const LinkStyle = styled(Typography.Link)`
  display: block;
  margin-bottom: 5px;
  color: white;

  .username{
    padding-left: 5px;
    color: white;
  }
`;

export default function RoomList() {
  const { currentUser } = useUserStore();

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupDataList, setGroupDataList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const groups = await roomJoined(currentUser.id);
      const groupDataList = await Promise.all(
        groups.map(async (groupId) => {
          const groupData = await fetchGroupData(groupId);
          return groupData;
        })
      );
      setGroupDataList(groupDataList);
    };

    fetchData();
  }, [currentUser.id]);

  const fetchGroupData = async (groupId) => {
    try {
      const groupRef = doc(db, "Groups", groupId);
      const groupSnapshot = await getDoc(groupRef);
      if (groupSnapshot.exists()) {
        const groupData = groupSnapshot.data();
        return groupData;
      } else {
        console.log("Group does not exist.");
        return null;
      }
    } catch (error) {
      console.error("Error getting group members:", error);
      return null;
    }
  };

  const handleShowAddGroup = () => {
    setShowAddGroup(true);
  };

  return (
    <>
      {!showAddGroup && (
        <Collapse ghost defaultActiveKey={['1']}>
          <PanelStyle header="Danh sách các phòng" key="1">
            {groupDataList.map((groupData) => (
              <LinkStyle key={groupData.id}>
                <Avatar src={groupData.urlImg}/>
                  {console.log(groupData.nameGroup,'   ',groupData.urlImg)}
                <Typography.Text className='username'>{groupData.nameGroup}</Typography.Text>
              </LinkStyle>
            ))}
            <Button
              type="text"
              icon={<PlusSquareOutlined />}
              className="add-room"
              onClick={handleShowAddGroup}
            >
              Thêm Phòng
            </Button>
          </PanelStyle>
        </Collapse>
      )}
      {showAddGroup && <AddGroup />}
    </>
  );
}