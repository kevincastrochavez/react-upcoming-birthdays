/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { IconSearch } from '@tabler/icons-react';
import { useTour } from '@reactour/tour';

import {
  useActionFriends,
  useSetSearch,
} from '../../components/BirthdayProvider';

import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import SearchFriend from '../../components/searchFriend/SearchFriend';
import SearchResults from '../../components/searchResults/SearchResults';
import { FriendInfo } from '../../components/friendInfo/FriendInfo';
import { useFriends } from '../../components/BirthdayProvider';
import NextFriends from '../../components/nextFriends/NextFriends';
import SpotlightEmpty from '../../components/friendInfo/SpotlightEmpty';
import { useEffect } from 'react';

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
`;

/**
 * Displays the Dashboard component, main part of application
 * @param {Function} setTourStep - function to set the tour step
 * @returns {JSX.Element}
 */
function Dashboard({ setTourStep }) {
  const { isFetchingFriends } = useActionFriends();
  const { spotlightFriend } = useFriends();
  const { setIsSearching } = useSetSearch();
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
      <SearchResults />
      {spotlightFriend?.fullName ? (
        <FriendInfo isSpotlight {...spotlightFriend} />
      ) : (
        <SpotlightEmpty />
      )}

      <NextFriends />
    </main>
  );
}

export default Dashboard;
