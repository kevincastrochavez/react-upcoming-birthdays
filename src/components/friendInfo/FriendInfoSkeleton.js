/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

const skeletonClosestCss = css`
  margin-left: auto;
`;

function FriendInfoSkeleton({ isSpotlight }) {
  return (
    <>
      {isSpotlight && (
        <Skeleton css={skeletonClosestCss} width={150} height={22} mb='xs' />
      )}
      <Skeleton height={192} />
    </>
  );
}

export default FriendInfoSkeleton;
