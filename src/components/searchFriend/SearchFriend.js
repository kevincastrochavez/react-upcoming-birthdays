import React from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

function SearchFriend() {
  const searchIcon = <IconSearch />;

  return (
    <TextInput
      size={'lg'}
      leftSectionPointerEvents='none'
      leftSection={searchIcon}
      placeholder='Search for a Friend'
      radius={10}
    />
  );
}

export default SearchFriend;
