/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import Canvas from '../../components/calendar/Canvas';

import facebookLogo from './../../assets/facebook.svg';
import googleLogo from './../../assets/google.svg';
import guestLogo from './../../assets/guest.svg';
import LoginBody from './LoginBody';

function Login() {
  const loginContainerCSS = css`
    padding: 0 24px;
  `;

  const loginCanvasCss = css`
    width: 100%;
    height: 200px;
    margin-top: 24px;
  `;

  return (
    <main css={loginContainerCSS}>
      <div css={loginCanvasCss}>
        <Canvas />
      </div>

      <LoginBody />
    </main>
  );
}

export default Login;
