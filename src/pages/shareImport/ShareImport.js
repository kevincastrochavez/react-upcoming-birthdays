/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';

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
    </main>
  );
}

export default ShareImport;
