/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const searchInputRightCss = css`
  & svg {
    margin-right: 12px;
  }
`;

/**
 * Displays the search friend component
 * @param {Function} placeholder - text to display in search input
 * @param {String} onClick - function to call when search button is clicked
 * @returns {JSX.Element}
 */
function SearchFriend({ onClick, placeholder }) {
  const searchIcon = <IconSearch />;

  return (
    <TextInput
      css={searchInputRightCss}
      size={'md'}
      rightSection={searchIcon}
      placeholder={placeholder}
      radius={10}
      onClick={onClick}
    />
  );
}

export default SearchFriend;
