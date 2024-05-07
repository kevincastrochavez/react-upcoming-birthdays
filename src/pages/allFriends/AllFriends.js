/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { useTour } from '@reactour/tour';

import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import {
  useActionFriends,
  useFriends,
  useSearch,
  useSetSearch,
} from '../../components/BirthdayProvider';
import MonthFriends from '../../components/monthFriends/MonthFriends';

const mainContainerCss = css`
  margin-bottom: 60px;

  & > h1 {
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 0 24px;
    font-size: 24px;
    font-weight: 400;
  }

  & > div:last-of-type {
    padding-bottom: 60px;
  }
`;

/**
 * Displays the AllFriends component page, main part for the AllFriends page
 * @param {Function} setTourStep - function to set the tour step
 * @returns {JSX.Element}
 */
function AllFriends({ setTourStep }) {
  const { isFetchingFriends } = useActionFriends();
  const { isSearching } = useSearch();
  const { setIsSearching } = useSetSearch();
  const { sortedBirthdaysByMonth } = useFriends();
  const { setIsOpen } = useTour();
  const searchIcon = <IconSearch />;

  useEffect(() => {
    const tour = window.localStorage.getItem('tour');

    setTimeout(() => {
      if (!isFetchingFriends && !tour) {
        window.localStorage.setItem('tour', 'true');
        setTourStep(0);
        setIsOpen(true);
      }
    }, 1500);
  }, []);

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <SearchFriend
        onClick={() => setIsSearching(true)}
        placeholder='Search for a Friend'
        icon={searchIcon}
      />

      {isSearching ? (
        <SearchResults />
      ) : (
        <>
          <h1>All Friends</h1>
          {sortedBirthdaysByMonth &&
            sortedBirthdaysByMonth.map((monthObj, index) => (
              <MonthFriends
                key={index}
                monthObj={monthObj}
                productTourSelector={index === 0 ? 'allFriends' : ''}
              />
            ))}
        </>
      )}
    </main>
  );
}

export default AllFriends;
