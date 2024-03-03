/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { signInWithPopup } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';

import { auth, provider } from '../../firebase';
import { useSetUserUid } from '../../components/BirthdayProvider';

import googleLogo from './../../assets/google.svg';
import guestLogo from './../../assets/guest.svg';

const loginHeadingCss = css`
  margin-top: 30px;
  font-size: 24px;
  max-width: 270px;
  font-weight: 400;
`;

const buttonsContainerCss = css`
  margin-top: 80px;
  display: grid;
  gap: 12px;
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background-color: #1877f2;
  color: white;
  border-radius: 10px;
  cursor: pointer;

  & p {
    font-size: 20px;
  }

  &[is-google='true'] {
    background-color: #fff;
    color: black;
  }

  &[is-guest='true'] {
    background-color: orange;
    color: black;
  }
`;

/**
 * Displays heading and login buttons for the Login component
 * @returns {JSX.Element}
 */
function LoginBody() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserUid } = useSetUserUid();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((response) => {
        const { from } = location.state || { from: { pathname: '/' } };
        const uid = response.user.uid;
        setUserUid(uid);
        navigate(from);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h1 css={loginHeadingCss}>
        The WebApp that will make your friends <strong>remember you</strong>{' '}
        because you <strong>remember them</strong>
      </h1>

      <div css={buttonsContainerCss}>
        <div
          data-testid='google-button'
          css={buttonCss}
          is-google='true'
          onClick={handleGoogleLogin}
        >
          <img src={googleLogo} alt='Google SVG' />
          <p>Continue with Google</p>
        </div>

        <div data-testid='guest-button' css={buttonCss} is-guest='true'>
          <img src={guestLogo} alt='Guest SVG' />
          <p>Continue as a Guest</p>
        </div>
      </div>
    </>
  );
}

export default LoginBody;
