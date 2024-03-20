/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { PlusIcon } from '@radix-ui/react-icons';

import { useSetAddingFriends } from '../BirthdayProvider';
import { Button } from '../../componentsShadcn/ui/button';

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
  max-width: 400px;
  display: grid;
  grid-column: 1;
  grid-row: 1;

  & button {
    grid-column: 1;
    grid-row: 2;
    width: fit-content;
    justify-self: end;
    margin-top: 40px;
  }
`;

/**
 * Displays the empty state component for the spotlight friend
 * @returns {JSX} the FriendInfo component
 */
function SpotlightEmpty() {
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <div css={friendContainerCss}>
      <h2>Your first friend will appear here, when you add one</h2>
      <Button
        onClick={() => setIsAddingFriend(true)}
        className='col-span-1 col-start-3'
      >
        <PlusIcon className='mr-2 h-5 w-5' /> Add your first Friend
      </Button>
    </div>
  );
}

export default SpotlightEmpty;
