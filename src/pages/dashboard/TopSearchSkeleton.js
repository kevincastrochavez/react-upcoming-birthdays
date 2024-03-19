/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

const skeletonSearchCss = css`
  display: flex;
  gap: 16px;
`;

/**
 * Displays the Skeleton for the top search part, incluiding the breadcrumbs
 * @param {Boolean} hasMoreBreadcrumbs - true if there are more breadcrumbs
 * @returns {JSX.Element}
 */
function TopSearchSkeleton({ hasMoreBreadcrumbs }) {
  return (
    <>
      <div css={skeletonSearchCss}>
        <Skeleton width={60} height={18} mb='md' />
        {hasMoreBreadcrumbs && <Skeleton width={60} height={18} mb='md' />}
      </div>
      <Skeleton height={42} mb='xl' />
      <Space h='xl' />
    </>
  );
}

export default TopSearchSkeleton;
