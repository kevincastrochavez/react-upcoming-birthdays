/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { TextInput } from '@mantine/core';

const searchInputRightCss = css`
  & svg {
    margin-right: 12px;
  }
`;

/**
 * Displays the search friend component
 * @param {String} onClick - function to call when search button is clicked
 * @param {Function} placeholder - text to display in search input
 * @param {Component} icon - icon to display in search input
 * @returns {JSX.Element}
 */
function SearchFriend({ onClick, placeholder, icon }) {
  return (
    <TextInput
      css={searchInputRightCss}
      size={'md'}
      rightSection={icon}
      placeholder={placeholder}
      radius={10}
      onClick={onClick}
    />
  );
}

export default SearchFriend;
