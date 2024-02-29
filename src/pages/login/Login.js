/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import Canvas from '../../components/calendar/Canvas';

function Login() {
  const loginContainerCSS = css`
    padding: 24px;
  `;

  const loginImgCss = css`
    width: 100%;
    height: 200px;
    margin-top: 30px;
  `;

  const loginHeadingCss = css`
    margin-top: 30px;
    font-size: 24px;
    max-width: 270px;
  `;

  return (
    <main css={loginContainerCSS}>
      <div css={loginImgCss}>
        <Canvas />
      </div>

      <h1 css={loginHeadingCss}>
        The WebApp that will make your friends remember you because you remember
        them
      </h1>
    </main>
  );
}

export default Login;
