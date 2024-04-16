/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Button } from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import {
  useFriends,
  useSetAddingFriends,
} from '../../components/BirthdayProvider';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';
import DeleteFriendModal from './DeleteFriendModal';
import EditFriend from '../../components/editFriend/EditFriend';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 60px;

  & > h1 {
    margin-top: 20px;
    margin-bottom: 60px;
    font-size: 24px;
    font-weight: 400;
  }
`;

const buttonsContainerCss = css`
  flex-direction: row;
  flex-wrap: nowrap;
`;

/**
 * Displays the FriendDetails component page, main part for the FriendDetails page
 * @returns {JSX.Element}
 */
function FriendDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { setIsEditingFriend } = useSetAddingFriends();
  const { friendsList: friends } = useFriends();
  const location = useLocation();
  const friendId = location.pathname.split('/')[2];

  const friendDetails = getFriendInfo(friends, friendId);
  const { firstName } = friendDetails;

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <EditFriend />

      <h1>{firstName ? `${firstName}'s` : 'Friend'} Info</h1>

      <FriendInfo {...friendDetails} />

      <Button
        leftSection={<IconEdit size={20} />}
        fullWidth
        className='mt-8'
        onClick={() => setIsEditingFriend(true)}
      >
        Edit {firstName || 'Friend'}'s Info
      </Button>

      <Button
        leftSection={<IconTrash size={20} />}
        fullWidth
        className='mt-4'
        variant={'light'}
        color={'red'}
        onClick={() => setIsDeleting(true)}
      >
        Delete {firstName || 'Friend'}
      </Button>

      <DeleteFriendModal
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        firstName={firstName}
        id={friendId}
      />
    </main>
  );
}

export default FriendDetails;

// PRIVATE FUNCTIONS

/**
 * Gets a single friend from the list of friends
 * @param {[Object]} friends - list of friends
 * @param {String} friendId - id of the friend
 * @returns {Object} friend
 */
function getFriendInfo(friends, friendId) {
  if (!friends) return {};
  if (!friendId) return {};

  return friends.find((friend) => friend.id === friendId) || {};
}
