/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Canvas from '../../components/calendar/Canvas';

import LoginBody from './LoginBody';

const loginContainerCSS = css`
  padding: 0 24px;
  max-width: 1024px;
  margin: 0 auto;
`;

const loginCanvasCss = css`
  width: 100%;
  height: 200px;
  margin-top: 24px;
`;

/**
 * Displays the Login component
 * @returns {JSX.Element}
 */
function Login() {
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
