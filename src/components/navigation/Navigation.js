/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';

import { auth } from '../../firebase';
import { useSetUserInfo } from '../BirthdayProvider';
import Logout from './Logout';
import { removeUserUid } from '../../helper/utils';
import logo from '../../assets/logo.svg';
import LanguagePicker from './LanguagePicker';

const navigationCSS = css`
  padding: 16px 24px;
  background: #f9f9fa;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;

  @media (min-width: 600px) {
    padding: 20px 30px;
  }
`;

const navigationWrapperCss = css`
  max-width: 1024px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
`;

const navigationLogoCSS = css`
  display: flex;
  align-items: center;
  gap: 20px;

  & img {
    width: 40px;
  }

  & p {
    font-size: 20px;
  }
`;

/**
 * Displays navigation component including the logo and navigation links
 * @returns {JSX.Element}
 */
function Navigation() {
  const { setUserUid } = useSetUserInfo();

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        setUserUid(null);
        removeUserUid('userUid');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <header css={navigationCSS}>
      <div css={navigationWrapperCss}>
        <Link css={navigationLogoCSS} to='/'>
          <img
            src={logo}
            alt='A clean, minimal, and warm logo for a web app called HappyB. The logo features a small, neatly wrapped gift box with a ribbon forming a bow. The color palette includes warm and cheerful colors like coral, teal, and soft gold. The typography is elegant, yet approachable sans-serif font with a slight italic.'
          />
          <p>Happy B!</p>
        </Link>

        <LanguagePicker />

        <Logout onClick={handleSignout} />
      </div>
    </header>
  );
}

export default Navigation;
