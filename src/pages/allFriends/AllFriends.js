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
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 1024px) {
    margin-top: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }

  & > h1 {
    margin-top: 40px;
    margin-bottom: 20px;
    padding: 0 24px;
    font-size: 24px;
    font-weight: 400;

    @media (min-width: 1024px) {
      grid-column: 1/2;
      grid-row: 2/3;
      margin-top: 0;
    }
  }

  & > div:last-of-type {
    padding-bottom: 60px;
  }
`;

const monthsContainerCss = css`
  @media (min-width: 600px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-column: 1/3;
    grid-row: 2/3;
    margin-top: 90px;
    grid-template-columns: repeat(3, 1fr);
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
          <div css={monthsContainerCss}>
            {sortedBirthdaysByMonth &&
              sortedBirthdaysByMonth.map((monthObj, index) => (
                <MonthFriends
                  key={index}
                  monthObj={monthObj}
                  productTourSelector={index === 0 ? 'allFriends' : ''}
                />
              ))}
          </div>
        </>
      )}
    </main>
  );
}

export default AllFriends;
