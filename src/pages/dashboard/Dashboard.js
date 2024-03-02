/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';

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
    </main>
  );
}

export default Dashboard;
