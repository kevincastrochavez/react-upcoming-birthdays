/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

const skeletonSearchCss = css`
  display: flex;
  gap: 16px;
`;

const skeletonShareCss = css`
  margin-top: 16px;
  display: flex;
  gap: 16px;
`;

/**
 * Displays the Skeleton for the top search part, incluiding the breadcrumbs
 * @param {Boolean} hasMoreBreadcrumbs - true if there are more breadcrumbs
 * @param {Boolean} isSharing - true if the page is the sharing or importing page
 * @returns {JSX.Element}
 */
function TopSearchSkeleton({ hasMoreBreadcrumbs = false, isSharing = false }) {
  return (
    <>
      <div css={skeletonSearchCss}>
        <Skeleton width={60} height={18} mb='md' />
        {hasMoreBreadcrumbs && <Skeleton width={60} height={18} mb='md' />}
      </div>

      {isSharing ? (
        <div css={skeletonShareCss}>
          <Skeleton width={160} height={28} mb='md' />
          <Skeleton width={160} height={28} mb='md' />
        </div>
      ) : (
        <Skeleton height={42} mb='xl' />
      )}
      <Space h='xl' />
    </>
  );
}

export default TopSearchSkeleton;
