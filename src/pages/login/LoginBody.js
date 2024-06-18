/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { signInWithPopup } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation, Trans, withTranslation } from 'react-i18next';

import { auth, provider } from '../../firebase';
import { useSetUserInfo } from '../../components/BirthdayProvider';

import googleLogo from './../../assets/google.svg';
import { saveUserUid } from '../../helper/utils';

const loginHeadingCss = css`
  margin-top: 30px;
  font-size: 20px;
  max-width: 700px;

  @media (min-width: 768px) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

const buttonsContainerCss = css`
  margin-top: 60px;
  display: grid;
  gap: 12px;
`;

const buttonCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 16px;
  background-color: #1877f2;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  background-color: #fff;
  color: black;
  max-width: 768px;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;

  @media (min-width: 768px) {
    width: 300px;
    margin: 0 auto;
  }
`;

/**
 * Displays heading and login buttons for the Login component
 * @returns {JSX.Element}
 */
function LoginBody() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserUid } = useSetUserInfo();
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((response) => {
        const { from } = location.state || { from: { pathname: '/' } };
        const uid = response.user.uid;
        setUserUid(uid);
        saveUserUid('userUid', uid);
        navigate(from);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h1 css={loginHeadingCss}>
        {
          <Trans i18nKey='login.message'>
            The WebApp that will make your friends <strong>remember you</strong>{' '}
            because you <strong>remember them</strong>
          </Trans>
        }
      </h1>

      <div css={buttonsContainerCss}>
        <div
          data-testid='google-button'
          css={buttonCss}
          is-google='true'
          onClick={handleGoogleLogin}
        >
          <img src={googleLogo} alt='Google SVG' />
          <p>{t('login.continueWithGoogle')}</p>
        </div>
      </div>
    </>
  );
}

export default withTranslation()(LoginBody);
