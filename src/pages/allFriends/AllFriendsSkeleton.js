/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

import TopSearchSkeleton from '../dashboard/TopSearchSkeleton';

const skeletonContainerCss = css`
  padding: 0 24px 24px 24px;
  margin-top: 24px;

  & div:after {
    background-color: darkgray;
  }
`;

const skeletonFriendsMonthCss = css`
  margin-top: 40px;
`;

/**
 * Displays the Skeleton for the AllFriends page
 * @returns {JSX.Element}
 */
function AllFriendsSkeleton() {
  return (
    <div css={skeletonContainerCss}>
      <TopSearchSkeleton hasMoreBreadcrumbs={true} />
      <Skeleton height={36} width={150} />

      <div css={skeletonFriendsMonthCss}>
        <Skeleton height={20} width={80} mb='xs' />
        <Skeleton height={60} mb='xs' />
        <Skeleton height={60} mb='xs' />
      </div>

      <div css={skeletonFriendsMonthCss}>
        <Skeleton height={20} width={80} mb='xs' mt='lx' />
        <Skeleton height={60} mb='xs' />
        <Skeleton height={60} mb='xs' />
      </div>
    </div>
  );
}

export default AllFriendsSkeleton;
