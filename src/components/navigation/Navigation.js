/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { signOut } from 'firebase/auth';

import { auth } from '../../firebase';
import { useSetUserUid } from '../BirthdayProvider';
import Logout from './Logout';

const navigationCSS = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: #f9f9fa;
  /* box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
  0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
  0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
  0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
  0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
  0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
  0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff; */
`;

const navigationLogoCSS = css`
  display: flex;
  align-items: center;
  gap: 20px;

  & img {
    width: 48px;
  }

  & p {
    font-size: 24px;
  }
`;

/**
 * Displays navigation component including the logo and navigation links
 * @returns {JSX.Element}
 */
function Navigation() {
  const { setUserUid } = useSetUserUid();

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        setUserUid(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <header>
      <nav css={navigationCSS}>
        <div css={navigationLogoCSS}>
          <img src='http://via.placeholder.com/200' alt='' />
          <p>Happy B!</p>
        </div>

        <Logout onClick={handleSignout} />
      </nav>
    </header>
  );
}

export default Navigation;
