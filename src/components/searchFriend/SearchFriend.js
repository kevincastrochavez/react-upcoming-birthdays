import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

import { useSetSearch } from '../BirthdayProvider';

/**
 * Displays the search friend component
 * @returns {JSX.Element}
 */
function SearchFriend() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { setIsSearching, setSearchText } = useSetSearch();
  const searchIcon = <IconSearch />;

  // console.log(value);

  const onSearchInputFocus = () => {
    setSearchParams({ searching: 'true' });
    setIsSearching(true);
  };

  const onSearchInputBlur = () => {
    setSearchParams((params) => {
      params.delete('searching');
      return params;
    });

    setIsSearching(false);
  };

  return (
    <TextInput
      size={'lg'}
      leftSectionPointerEvents='none'
      leftSection={searchIcon}
      placeholder='Search for a Friend'
      radius={10}
      onFocus={onSearchInputFocus}
      onBlur={onSearchInputBlur}
      onChange={(event) => setSearchText(event.currentTarget.value)}
    />
  );
}

export default SearchFriend;
