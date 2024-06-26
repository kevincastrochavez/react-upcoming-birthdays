/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { t } from 'i18next';

import { useUserInfo } from '../BirthdayProvider';
import logout from '../../assets/logout.svg';

const navigationLogoutCSS = css`
  display: flex;
  gap: 8px;

  & img {
    width: 24px;
  }

  & p {
    font-size: 14px;
    margin-top: 1px;
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
      <p>{t('logout')}</p>
    </div>
  ) : (
    <></>
  );

  return logoutComponent;
}

export default Logout;
