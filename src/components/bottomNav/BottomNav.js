/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tabs, rem } from '@mantine/core';
import { IconUsersGroup, IconQrcode } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import classes from './BottomNav.module.css';

const bottomNavContainerCss = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;
`;

const bottomNavTabCss = css`
  padding: 16px;
  display: grid;
  gap: 8px;

  & span {
    margin: 0;
  }

  & svg {
    width: 20px;
  }
`;

/**
 * Displays the BottomNav component
 * @returns {JSX.Element}
 */
function BottomNav() {
  const navigate = useNavigate();

  return (
    <Tabs
      variant='unstyled'
      defaultValue='settings'
      css={bottomNavContainerCss}
      classNames={classes}
    >
      <Tabs.List grow>
        <Tabs.Tab
          css={bottomNavTabCss}
          value='All Friends'
          leftSection={<IconUsersGroup />}
          onClick={() => navigate('/allFriends')}
        >
          All Friends
        </Tabs.Tab>
        <Tabs.Tab
          css={bottomNavTabCss}
          value='Share/Import'
          leftSection={<IconQrcode />}
          onClick={() => navigate('/shareImport')}
        >
          Share/Import
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}

export default BottomNav;
