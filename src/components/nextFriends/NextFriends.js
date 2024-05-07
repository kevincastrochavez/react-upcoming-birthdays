/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import { useFriends } from '../../components/BirthdayProvider';
import NextFriend from './NextFriend';
import NextFriendEmpty from './NextFriendEmpty';

const nextFiveContainerCss = css`
  margin-top: 60px;
  padding-bottom: 30px;

  & > p {
    text-align: right;
    margin-bottom: 8px;
    padding: 0 24px;
  }
`;

const nextFiveInnerContainerCss = css`
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  padding-bottom: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

/**
 * Displays the NextFriends component, which displays the next 5 friends in the list
 * @returns {JSX.Element}
 */
function NextFriends() {
  const { nextFiveFriends } = useFriends();
  const maximumNextFiveFriends = 5;
  const emptyNextFriendSlots = maximumNextFiveFriends - nextFiveFriends.length;
  const emptyNextFriendSlotsArray = Array(emptyNextFriendSlots).fill(1);

  return (
    <div css={nextFiveContainerCss} data-tour='nextFriends'>
      <p>Next 5 birthdays</p>

      <div css={nextFiveInnerContainerCss}>
        {nextFiveFriends.map(({ friend }) => (
          <Link key={friend.id} to={`/allFriends/${friend.id}`}>
            <NextFriend friend={friend} />
          </Link>
        ))}
        {emptyNextFriendSlotsArray.length > 0 && <NextFriendEmpty />}
      </div>
    </div>
  );
}

export default NextFriends;
