/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Tabs } from '@mantine/core';
import {
  IconUsersGroup,
  IconQrcode,
  IconHome,
  IconUserPlus,
} from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActionIcon } from '@mantine/core';
import { t } from 'i18next';

import classes from './BottomNav.module.css';
import { useSetAddingFriends } from '../BirthdayProvider';

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
  padding: 12px;
  display: grid;
  gap: 8px;
  border-right: 1px solid #ebebeb;

  @media (min-width: 1024px) {
    padding: 20px;
  }

  & span {
    margin: 0;
  }

  & svg {
    width: 20px;
  }
`;

const addFriendCss = css`
  position: fixed;
  bottom: 90px;
  right: 24px;

  @media (min-width: 600px) {
    right: 30px;
    bottom: 100px;
  }

  @media (min-width: 1024px) {
    right: 60px;
    bottom: 140px;
  }
`;

/**
 * Displays the BottomNav component
 * @returns {JSX.Element}
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <footer>
      <Tabs
        variant='unstyled'
        defaultValue='settings'
        css={bottomNavContainerCss}
        classNames={classes}
      >
        <Tabs.List grow>
          <Tabs.Tab
            css={bottomNavTabCss}
            value='Home'
            leftSection={<IconHome />}
            onClick={() => navigate('/')}
            is-tab-active={location.pathname === '/' ? 'true' : 'false'}
          >
            {t('Home')}
          </Tabs.Tab>
          <Tabs.Tab
            css={bottomNavTabCss}
            value='All Friends'
            leftSection={<IconUsersGroup />}
            onClick={() => navigate('/allFriends')}
            is-tab-active={
              location.pathname === '/allFriends' ? 'true' : 'false'
            }
          >
            {t('All Friends')}
          </Tabs.Tab>
          <Tabs.Tab
            css={bottomNavTabCss}
            value='Share/Import'
            leftSection={<IconQrcode />}
            onClick={() => navigate('/shareImport')}
            is-tab-active={
              location.pathname === '/shareImport' ? 'true' : 'false'
            }
          >
            {t('Share/Import')}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <ActionIcon
        css={addFriendCss}
        variant='filled'
        size='xl'
        radius='xl'
        aria-label='Settings'
        onClick={() => setIsAddingFriend(true)}
        data-tour='addFriend'
      >
        <IconUserPlus style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ActionIcon>
    </footer>
  );
}

export default BottomNav;
