/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { IconSearch } from '@tabler/icons-react';

import { useSetSearch } from '../../components/BirthdayProvider';

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

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  // TODO: fix spotlight when birthday is in the past, as well as next 5 friends
  const { spotlightFriend } = useFriends();
  const { setIsSearching } = useSetSearch();
  const searchIcon = <IconSearch />;

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
    </main>
  );
}

export default Dashboard;
