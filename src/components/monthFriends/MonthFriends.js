/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import MonthFriend from '../monthFriend/MonthFriend';

const monthContainerCss = css`
  margin-bottom: 40px;

  & > h2 {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 8px;
  }
`;

/**
 * Displays the MonthFriendS component, which displays the list of all friends in such month
 * @param {Object} monthObj - month and list of friends in that month
 * @returns {JSX.Element}
 */
function MonthFriends({ monthObj }) {
  const { friends } = monthObj;

  return (
    <div css={monthContainerCss}>
      <h2>{monthObj.month}</h2>
      {friends.length > 0 ? (
        friends.map(
          ({ imageUrl, formattedFullName, birthdateFormatted }, index) => (
            <MonthFriend
              key={index}
              imageUrl={imageUrl}
              formattedFullName={formattedFullName}
              shortenedBirthdateFormatted={birthdateFormatted}
            />
          )
        )
      ) : (
        <p>No friends this month</p>
      )}
    </div>
  );
}

export default MonthFriends;
