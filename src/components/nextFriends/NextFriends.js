/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import { useFriends } from '../../components/BirthdayProvider';
import NextFriend from './NextFriend';
import NextFriendEmpty from './NextFriendEmpty';

const nextFiveContainerCss = css`
  margin-top: 60px;

  & > p {
    text-align: right;
    margin-bottom: 8px;
  }
`;

const nextFiveInnerContainerCss = css`
  display: flex;
  gap: 12px;
  overflow: hidden;
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
    <div css={nextFiveContainerCss}>
      <p>Next 5 birthdays</p>

      <div css={nextFiveInnerContainerCss}>
        {nextFiveFriends.map(({ friend }) => (
          <Link key={friend.id} to={`/allFriends/${friend.id}`}>
            <NextFriend friend={friend} />
          </Link>
        ))}
        {emptyNextFriendSlotsArray.map((nextFriend, index) => (
          <NextFriendEmpty key={index} />
        ))}
      </div>
    </div>
  );
}

export default NextFriends;
