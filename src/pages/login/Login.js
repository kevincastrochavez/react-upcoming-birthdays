/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import Canvas from '../../components/calendar/Canvas';

import facebookLogo from './../../assets/facebook.svg';
import googleLogo from './../../assets/google.svg';
import guestLogo from './../../assets/guest.svg';

function Login() {
  const loginContainerCSS = css`
    padding: 0 24px;
  `;

  const loginCanvasCss = css`
    width: 100%;
    height: 200px;
    margin-top: 24px;
  `;

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

    &[is-facebook='true'] {
      background-color: #1877f2;
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

  return (
    <main css={loginContainerCSS}>
      <div css={loginCanvasCss}>
        <Canvas />
      </div>

      <h1 css={loginHeadingCss}>
        The WebApp that will make your friends <strong>remember you</strong>{' '}
        because you <strong>remember them</strong>
      </h1>

      <div css={buttonsContainerCss}>
        <div css={buttonCss} is-facebook='true'>
          <img src={facebookLogo} alt='Facebook SVG' />
          <p>Continue with Facebook</p>
        </div>

        <div css={buttonCss} is-google='true'>
          <img src={googleLogo} alt='Google SVG' />
          <p>Continue with Google</p>
        </div>

        <div css={buttonCss} is-guest='true'>
          <img src={guestLogo} alt='Guest SVG' />
          <p>Continue as a Guest</p>
        </div>
      </div>
    </main>
  );
}

export default Login;
