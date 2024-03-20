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

const skeletonQrCodeCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  margin-bottom: 40px;
`;

/**
 * Displays the Skeleton for the ShareImport page
 * @returns {JSX.Element}
 */
function ShareImportSkeleton() {
  return (
    <div css={skeletonContainerCss}>
      <TopSearchSkeleton hasMoreBreadcrumbs={true} isSharing={true} />
      <Skeleton height={120} mb='lg' />
      <div css={skeletonQrCodeCss}>
        <Skeleton height={200} width={200} />
        <Skeleton height={40} width={40} radius={'50%'} />
      </div>
      <Skeleton height={14} width={160} mb='xs' />
      <Skeleton height={40} />
    </div>
  );
}

export default ShareImportSkeleton;
