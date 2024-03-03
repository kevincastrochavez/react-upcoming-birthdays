/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbsContainerCss = css`
  display: flex;
`;

/**
 * Displays the breadcrumbs according to the page you are in
 * @returns {JSX.Element}
 */
function BreadcrumbsComponent() {
  const { pathname } = useLocation();
  const urlFragments = pathname
    .split('/')
    .filter((fragment) => fragment !== '');

  console.log(pathname);
  console.log(urlFragments);

  return (
    <div css={breadcrumbsContainerCss}>
      <Link href='/'>Dashboard</Link>
    </div>
  );
}

export default BreadcrumbsComponent;
