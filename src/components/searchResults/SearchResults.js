/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { useSearch } from '../BirthdayProvider';
import MonthFriend from '../monthFriend/MonthFriend';

const headingResultsCss = css`
  margin-top: 60px;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 400;
`;

function ShareResults() {
  const { friendsFilteredBySearch } = useSearch();

  return (
    <>
      <h1 css={headingResultsCss}>Friends Results</h1>

      {friendsFilteredBySearch?.map((friend) => (
        <MonthFriend {...friend} key={friend.birthdate} />
      ))}
    </>
  );
}

export default ShareResults;
