/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { IconCheck, IconSearch } from '@tabler/icons-react';
import { Notification } from '@mantine/core';

import {
  useAddingFriends,
  useSetAddingFriends,
  useSetSearch,
} from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';
import { useFriends } from '../../components/BirthdayProvider';
import NextFriends from '../../components/nextFriends/NextFriends';
import SpotlightEmpty from '../../components/friendInfo/SpotlightEmpty';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 60px;
`;

const addedNotificationCss = css`
  position: fixed;
  top: 12px;
  left: 24px;
  right: 24px;
  z-index: 10;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  // TODO: fix spotlight when birthday is in the past, as well as next 5 friends
  const { spotlightFriend } = useFriends();
  const { setIsSearching } = useSetSearch();
  const { friendWasAdded } = useAddingFriends();
  const { setFriendWasAdded } = useSetAddingFriends();
  const searchIcon = <IconSearch />;
  const checkIcon = <IconCheck />;

  if (friendWasAdded) {
    setTimeout(() => {
      setFriendWasAdded(false);
    }, 3000);
  }

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend
        onClick={() => setIsSearching(true)}
        placeholder='Search for a Friend'
        icon={searchIcon}
      />
      <SearchResults />
      {spotlightFriend?.fullName ? (
        <FriendInfo isSpotlight {...spotlightFriend} />
      ) : (
        <SpotlightEmpty />
      )}

      <NextFriends />

      {friendWasAdded && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friend was successfully added'
          withBorder
          onClose={() => setFriendWasAdded(false)}
        />
      )}
    </main>
  );
}

export default Dashboard;
