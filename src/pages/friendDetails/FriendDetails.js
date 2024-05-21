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
import { t } from 'i18next';

const mainContainerCss = css`
  margin-bottom: 60px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  padding-bottom: 24px;

  @media (min-width: 1024px) {
    padding-bottom: 0;
    margin-top: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  & > h1 {
    margin-top: 20px;
    margin-bottom: 60px;
    padding: 0 24px;
    font-size: 24px;
    font-weight: 400;

    @media (min-width: 600px) {
      padding: 0 30px;
    }

    @media (min-width: 1024px) {
      grid-column: 1/3;
      grid-row: 2/3;
      margin: 0;
      padding: 0;
    }
  }

  & > a {
    justify-self: center;
    grid-column: 1/-1;
    grid-row: 3/4;
  }
`;

const btnContainerCss = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 32px;

  & > button {
    width: calc(100% - 48px);
    max-width: 360px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 600px) {
    display: flex;
    flex-direction: row;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;

    & > button:first-of-type {
      order: 2;
    }
  }

  @media (min-width: 1024px) {
    grid-column: 1/3;
    grid-row: 4/5;

    & > button {
      width: 192px;
    }
  }
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

      <h1>{`${firstName || t('friendDetails.friend')} ${t(
        'friendDetails.title'
      )}`}</h1>

      <FriendInfo {...friendDetails} />

      <div css={btnContainerCss}>
        <Button
          leftSection={<IconEdit size={20} />}
          fullWidth
          onClick={() => setIsEditingFriend(true)}
          disabled={!firstName}
        >
          {t('friendDetails.edit')} {firstName || 'Friend'}{' '}
          {t('friendDetails.info')}
        </Button>

        <Button
          leftSection={<IconTrash size={20} />}
          fullWidth
          variant={'light'}
          color={'red'}
          onClick={() => setIsDeleting(true)}
          disabled={!firstName}
        >
          {t('friendDetails.delete')} {firstName || 'Friend'}
        </Button>
      </div>

      <DeleteFriendModal
        isDeleting={isDeleting}
        setIsDeleting={setIsDeleting}
        {...friendDetails}
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
export function getFriendInfo(friends, friendId) {
  if (!friends) return {};
  if (!friendId) return {};

  return friends.find((friend) => friend.id === friendId) || {};
}
