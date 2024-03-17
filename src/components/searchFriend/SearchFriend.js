import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

import { useSetSearch } from '../BirthdayProvider';

/**
 * Displays the search friend component
 * @returns {JSX.Element}
 */
function SearchFriend() {
  const { setIsSearching } = useSetSearch();
  const searchIcon = <IconSearch />;

  return (
    <TextInput
      size={'md'}
      leftSectionPointerEvents='none'
      leftSection={searchIcon}
      placeholder='Search for a Friend'
      radius={10}
      onClick={() => setIsSearching(true)}
    />
  );
}

export default SearchFriend;
