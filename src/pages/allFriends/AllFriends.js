/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';

const mainContainerCss = css`
  padding: 24px;
`;

/**
 * Displays the AllFriends component page, main part for the AllFriends page
 * @returns {JSX.Element}
 */
function AllFriends() {
  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
    </main>
  );
}

export default AllFriends;
