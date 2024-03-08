/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { useIsSearching } from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import ShareResults from '../../components/searchResults/ShareResults';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { isSearching } = useIsSearching();

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend />
      {/* {isSearching && <ShareResults />} */}
      <ShareResults />
    </main>
  );
}

export default Dashboard;
