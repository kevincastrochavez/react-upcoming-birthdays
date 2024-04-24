/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton } from '@mantine/core';

import FriendInfoSkeleton from '../../components/friendInfo/FriendInfoSkeleton';

const skeletonContainerCss = css`
  padding: 0 24px 24px 24px;
  margin-top: 24px;

  & div:after {
    background-color: darkgray;
  }
`;

const skeletonSearchCss = css`
  display: flex;
  gap: 16px;
`;

/**
 * Displays the Skeleton for the Friend Details page
 * @returns {JSX.Element}
 */
function FriendDetailsSkeleton() {
  return (
    <div css={skeletonContainerCss}>
      <div css={skeletonSearchCss}>
        <Skeleton width={60} height={18} mb='md' />
        <Skeleton width={60} height={18} mb='md' />
        <Skeleton width={60} height={18} mb='md' />
      </div>

      <Skeleton width={150} height={24} mb='lg' mt={'lg'} />

      <FriendInfoSkeleton />

      <Skeleton height={32} mb='xs' mt={'xl'} />
      <Skeleton height={32} mb='lg' />
    </div>
  );
}

export default FriendDetailsSkeleton;
