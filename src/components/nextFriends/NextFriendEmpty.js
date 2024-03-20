/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { PlusIcon } from '@radix-ui/react-icons';

import { useSetAddingFriends } from '../BirthdayProvider';

const nextFriendContainerCss = css`
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;
  font-size: 12px;

  display: grid;
  grid-template-columns: auto max-content;
  grid-template-rows: auto;
  column-gap: 12px;
  width: fit-content;

  & p {
    align-self: center;
    font-size: 16px;
  }
`;

const nextFriendIconCss = css`
  width: 32px;
  height: 32px;
  align-self: center;
`;

/**
 * Displays the empty state component for the NextFriend
 * @returns {JSX} the FriendInfo component
 */
function NextFriendEmpty() {
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <div css={nextFriendContainerCss} onClick={() => setIsAddingFriend(true)}>
      <PlusIcon css={nextFriendIconCss} />
      <p>Add friend</p>
    </div>
  );
}

export default NextFriendEmpty;
