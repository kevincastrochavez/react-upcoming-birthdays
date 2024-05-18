/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IconFriends } from '@tabler/icons-react';

import { useSetAddingFriends } from '../BirthdayProvider';
import { Button } from '@mantine/core';

const friendContainerCss = css`
  margin-top: 60px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;
  width: calc(100% - 48px);
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  display: grid;
  grid-column: 1;
  grid-row: 1;

  & > svg {
    color: #228be6;
    width: 50px;
    height: 50px;
    justify-self: center;
    stroke-width: 1.5;
  }

  & h2 {
    justify-self: center;
    font-weight: 500;
    margin-top: 8px;
  }

  & p {
    justify-self: center;
    font-size: 14px;
    color: #857e7e;
  }

  & button {
    justify-self: center;
    margin-top: 30px;
  }
`;

/**
 * Displays the empty state component for the spotlight friend
 * @returns {JSX} the FriendInfo component
 */
function SpotlightEmpty() {
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <div css={friendContainerCss} data-tour='spotlightFriend'>
      <IconFriends />
      <h2>No Friends</h2>
      <p>Start adding your friends to your list.</p>

      <Button
        onClick={() => setIsAddingFriend(true)}
        data-tour='addFriend'
        size='md'
      >
        Add your First Friend
      </Button>
    </div>
  );
}

export default SpotlightEmpty;
