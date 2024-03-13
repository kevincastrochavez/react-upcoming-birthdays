/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import Share from '../../components/share/Share';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the ShareImport component page
 * @returns {JSX.Element}
 */
function ShareImport() {
  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <Share />
    </main>
  );
}

export default ShareImport;
