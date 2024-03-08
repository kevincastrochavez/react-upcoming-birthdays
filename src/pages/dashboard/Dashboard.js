/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { useSearch } from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  const { isSearching } = useSearch();

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend />
      {/* {isSearching && <SearchResults />} */}
      <SearchResults />
    </main>
  );
}

export default Dashboard;
