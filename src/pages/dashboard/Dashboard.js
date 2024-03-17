/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { useSetSearch } from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';
import { useFriends } from '../../components/BirthdayProvider';
import NextFriends from '../../components/nextFriends/NextFriends';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 60px;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { spotlightFriend } = useFriends();
  const { setIsSearching } = useSetSearch();
  const {
    formattedFullName,
    imageUrl,
    likesToCelebrate,
    favoriteColor,
    candyPreference,
    birthdate,
    firstName,
  } = spotlightFriend;

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend
        onClick={() => setIsSearching(true)}
        placeholder='Search for a Friend'
      />
      <SearchResults />
      <FriendInfo
        isSpotlight
        firstName={firstName}
        formattedFullName={formattedFullName}
        imageUrl={imageUrl}
        likesToCelebrate={likesToCelebrate}
        favoriteColor={favoriteColor}
        candyPreference={candyPreference}
        birthdate={birthdate}
      />

      <NextFriends />
    </main>
  );
}

export default Dashboard;
