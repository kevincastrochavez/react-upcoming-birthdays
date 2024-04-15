/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useLocation } from 'react-router-dom';

import { useFriends } from '../../components/BirthdayProvider';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';

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

/**
 * Displays the FriendDetails component page, main part for the FriendDetails page
 * @returns {JSX.Element}
 */
function FriendDetails() {
  const { friendsList: friends } = useFriends();
  const location = useLocation();
  const friendId = location.pathname.split('/')[2];

  const friendDetails = getFriendInfo(friends, friendId);

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />

      <h1>
        {friendDetails.firstName ? `${friendDetails.firstName}'s` : 'Friend'}{' '}
        Info
      </h1>
      <FriendInfo {...friendDetails} />
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
