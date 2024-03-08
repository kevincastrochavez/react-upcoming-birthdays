/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

// Define custom breadcrumbs for certain routes.
const routes = [
  { path: '/', breadcrumb: 'Dashboard' },
  { path: '/allFriends', breadcrumb: 'All Friends' },
  { path: '/shareImport', breadcrumb: 'Share or Import' },
];

const breadcrumbsCSS = css`
  display: flex;
  gap: 8px;
  margin-bottom: 30px;

  & a {
    text-decoration: none;
    color: black;
  }

  & a:not(.active) {
    color: blue;
  }
`;

/**
 * Displays the Breadcrumbs component and links
 * @returns {JSX.Element}
 */
const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <nav css={breadcrumbsCSS}>
      {breadcrumbs?.map(({ match, breadcrumb }, index) => (
        <React.Fragment key={match.pathname}>
          <NavLink to={match.pathname} data-testid={match.pathname}>
            {breadcrumb}
          </NavLink>
          {index !== breadcrumbs.length - 1 && '/'}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
