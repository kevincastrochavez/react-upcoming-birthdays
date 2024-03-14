/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import { useFriends, useSearch } from '../../components/BirthdayProvider';
import MonthFriends from '../../components/monthFriends/MonthFriends';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 60px;

  & > h1 {
    margin-top: 60px;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 400;
  }
`;

/**
 * Displays the AllFriends component page, main part for the AllFriends page
 * @returns {JSX.Element}
 */
function AllFriends() {
  const { isSearching } = useSearch();
  const { sortedBirthdaysByMonth } = useFriends();

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend />

      {isSearching ? (
        <SearchResults />
      ) : (
        <>
          <h1>All Friends</h1>
          {sortedBirthdaysByMonth &&
            sortedBirthdaysByMonth.map((monthObj, index) => (
              <MonthFriends key={index} monthObj={monthObj} />
            ))}
        </>
      )}
    </main>
  );
}

export default AllFriends;
