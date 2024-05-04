/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

import { useFriends } from '../BirthdayProvider';

// Define custom breadcrumbs for certain routes.
const routes = [
  { path: '/', breadcrumb: 'Home' },
  { path: '/allFriends', breadcrumb: 'All Friends' },
  { path: '/shareImport', breadcrumb: 'Share or Import' },
];

const breadcrumbsCSS = css`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  & a {
    text-decoration: none;
    color: black;
    font-size: 12px;
  }

  & a:not(.active) {
    color: blue;
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
    <nav css={breadcrumbsCSS}>
      {breadcrumbs?.map(({ match, breadcrumb }, index) => {
        let textToDisplay = breadcrumb;

        if (index === 2) {
          const currentFriendId = match.pathname.split('/')[2];
          const { formattedFullName } = friendsList.find(
            (friend) => friend.id === currentFriendId
          );

          textToDisplay = formattedFullName;
        }

        return (
          <React.Fragment key={match.pathname}>
            <NavLink to={match.pathname} data-testid={match.pathname}>
              {textToDisplay}
            </NavLink>
            {index !== breadcrumbs.length - 1 && <span>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
