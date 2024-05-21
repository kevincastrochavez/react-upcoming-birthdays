/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { t } from 'i18next';

import { useFriends } from '../../components/BirthdayProvider';
import NextFriend from './NextFriend';
import NextFriendEmpty from './NextFriendEmpty';

const nextFiveContainerCss = css`
  margin-top: 60px;
  padding-bottom: 30px;

  @media (min-width: 1024px) {
    margin-top: 0;
  }

  & > p {
    text-align: right;
    margin-bottom: 8px;
    padding: 0 24px;

    @media (min-width: 600px) {
      padding: 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const nextFiveInnerContainerCss = css`
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  padding-bottom: 30px;

  @media (min-width: 600px) {
    padding: 0 30px 24px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    flex-wrap: wrap;
  }

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
      <p>{t('nextFriends.title')}</p>

      <div css={nextFiveInnerContainerCss}>
        {emptyNextFriendSlotsArray.length > 0 && <NextFriendEmpty />}
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
