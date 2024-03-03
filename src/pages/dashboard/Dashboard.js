/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the Dashboard component, main part of application
 * @returns {JSX.Element}
 */
function Dashboard() {
  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend />
    </main>
  );
}

export default Dashboard;
