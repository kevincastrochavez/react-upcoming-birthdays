/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

import FriendInfoSkeleton from '../../components/friendInfo/FriendInfoSkeleton';

const skeletonContainerCss = css`
  padding: 0 24px 24px 24px;
  margin-top: 24px;

  & div:after {
    background-color: darkgray;
  }
`;

const skeletonNextFiveCss = css`
  margin-left: auto;
`;

const skeletonNextFiveWrapperCss = css`
  display: flex;
  gap: 12px;
  overflow: hidden;

  & div {
    min-width: 140px;
  }
`;

/**
 * Displays the Skeleton for the Dashboard page
 * @returns {JSX.Element}
 */
function DashboardSkeleton() {
  const friendsCount = [1, 2, 3, 4, 5];

  return (
    <div css={skeletonContainerCss}>
      <Skeleton width={60} height={18} mb='md' />
      <Skeleton height={42} mb='xl' />
      <Space h='xl' />
      <FriendInfoSkeleton isSpotlight={true} />
      <Space h='xl' />
      <Skeleton
        css={skeletonNextFiveCss}
        width={150}
        height={22}
        mt='xl'
        mb={'xs'}
      />

      <div css={skeletonNextFiveWrapperCss}>
        {friendsCount?.map((friend) => (
          <Skeleton width={160} height={80} />
        ))}
      </div>
    </div>
  );
}

export default DashboardSkeleton;