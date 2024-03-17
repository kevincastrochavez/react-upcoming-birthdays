/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import { useFriends } from '../../components/BirthdayProvider';
import NextFriend from './NextFriend';

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

function NextFriends() {
  const { nextFiveFriends } = useFriends();

  return (
    <div css={nextFiveContainerCss}>
      <p>Next 5 birthdays</p>

      <div css={nextFiveInnerContainerCss}>
        {nextFiveFriends.map(({ friend }) => (
          <Link key={friend.id} to={`/allFriends/${friend.id}`}>
            <NextFriend friend={friend} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default NextFriends;
