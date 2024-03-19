/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Skeleton, Space } from '@mantine/core';

const skeletonContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-top: 24px;

  & div:after {
    background-color: darkgray;
  }
`;

/**
 * Displays the Skeleton for the Login page
 * @returns {JSX.Element}
 */
function LoginSkeleton() {
  return (
    <div css={skeletonContainerCss}>
      <Skeleton height={200} mb='xl' />
      <Space h='xl' />
      <Skeleton height={20} mb='xs' />
      <Skeleton height={20} mb='xs' />
      <Skeleton height={20} width={'70%'} />
      <Space h='xl' />
      <Skeleton height={40} mt='xl' mb='sm' />
      <Skeleton height={40} />
    </div>
  );
}

export default LoginSkeleton;
