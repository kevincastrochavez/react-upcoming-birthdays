/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';

import { useSetAddingFriends } from '../BirthdayProvider';
import MonthFriend from '../monthFriend/MonthFriend';

const monthContainerCss = css`
  margin-bottom: 40px;
  padding: 0 24px;

  & > h2 {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 8px;
  }

  & > span:last-of-type {
    color: #228be6;
  }
`;

/**
 * Displays the MonthFriendS component, which displays the list of all friends in such month
 * @param {Object} monthObj - month and list of friends in that month
 * @returns {JSX.Element}
 */
function MonthFriends({ monthObj }) {
  const { setIsAddingFriend } = useSetAddingFriends();
  const { friends } = monthObj;

  return (
    <div css={monthContainerCss}>
      <h2>{monthObj.month}</h2>
      {friends.length > 0 ? (
        friends.map(
          ({ imageUrl, formattedFullName, birthdateFormatted, id }) => (
            <Link key={id} to={`/allFriends/${id}`}>
              <MonthFriend
                imageUrl={imageUrl}
                formattedFullName={formattedFullName}
                shortenedBirthdateFormatted={birthdateFormatted}
              />
            </Link>
          )
        )
      ) : (
        <>
          <span>No friends this month yet. </span>
          <span onClick={() => setIsAddingFriend(true)}>Add your first!</span>
        </>
      )}
    </div>
  );
}

export default MonthFriends;
