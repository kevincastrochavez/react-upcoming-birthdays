/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { t } from 'i18next';

import { useFriends } from '../BirthdayProvider';

// Define custom breadcrumbs for certain routes.
const routes = [
  { path: '/', breadcrumb: 'Home' },
  { path: '/allFriends', breadcrumb: 'All Friends' },
  { path: '/shareImport', breadcrumb: 'Share or Import' },
];

const breadcrumbsCss = css`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  margin-top: 12px;
  padding: 0 24px;

  @media (min-width: 600px) {
    padding: 0 30px;
  }

  @media (min-width: 1024px) {
    padding: 0;
    grid-column: 1/2;
    margin-top: 0;
  }

  & a {
    text-decoration: none;
    color: black;
    font-size: 12px;
  }

  & a:not(:last-of-type) {
    color: #228be6;
  }

  & span {
    font-size: 12px;
    display: flex;
  }
`;

/**
 * Displays the Breadcrumbs component and links
 * @returns {JSX.Element}
 */
const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);
  const { friendsList } = useFriends();

  return (
    <nav css={breadcrumbsCss}>
      {breadcrumbs?.map(({ match, breadcrumb }, index) => {
        let textToDisplay = breadcrumb;

        if (index === 2) {
          const currentFriendId = match.pathname.split('/')[2];
          const currentFriend = friendsList.find(
            (friend) => friend.id === currentFriendId
          );

          if (!currentFriend) return;

          textToDisplay = currentFriend.formattedFullName;
        }

        return (
          <React.Fragment key={match.pathname}>
            <NavLink to={match.pathname} data-testid={match.pathname}>
              {t(textToDisplay?.props?.children) || textToDisplay}
            </NavLink>
            {index !== breadcrumbs.length - 1 && <span>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
