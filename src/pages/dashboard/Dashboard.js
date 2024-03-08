/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { useSearch } from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';
import { useFriends } from '../../components/BirthdayProvider';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { isSearching } = useSearch();
  const { spotlightFriend } = useFriends();
  const {
    formattedFullName,
    imageUrl,
    likesToCelebrate,
    favoriteColor,
    candyPreference,
    birthdate,
    firstName,
  } = spotlightFriend;
  console.log(spotlightFriend);

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend />
      {isSearching ? (
        <SearchResults />
      ) : (
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
      )}
    </main>
  );
}

export default Dashboard;
