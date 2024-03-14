/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';

import { useUserInfo } from '../BirthdayProvider';
import logout from '../../assets/logout.svg';

const navigationLogoutCSS = css`
  display: flex;
  gap: 8px;

  & img {
    width: 30px;
  }

  & p {
    font-size: 20px;
  }
`;

/**
 * Displays logout button and text for logging user out
 * @returns {JSX.Element}
 */
function Logout({ onClick }) {
  const { userUid } = useUserInfo();

  const logoutComponent = !!userUid ? (
    <div onClick={onClick} css={navigationLogoutCSS}>
      <img src={logout} alt='Happy B logo' />
      <p>Logout</p>
    </div>
  ) : (
    <></>
  );

  return logoutComponent;
}

export default Logout;
