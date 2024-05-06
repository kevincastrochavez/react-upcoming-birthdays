/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { TextInput } from '@mantine/core';

const searchInputRightCss = css`
  padding: 0 24px;

  & svg {
    margin-right: 12px;
  }

  & input {
    &[is-copy='true'] {
      font-size: 14px;
    }
  }
`;

const copyInputRightCss = css`
  & svg {
    margin-right: 0;
  }
`;

/**
 * Displays the search friend component
 * @param {String} onClick - function to call when search button is clicked
 * @param {Function} placeholder - text to display in search input
 * @param {Component} icon - icon to display in search input
 * @param {Component} value - value to display in search input
 * @param {Component} disabled - whether search input is disabled
 * @returns {JSX.Element}
 */
function SearchFriend({
  onClick = () => {},
  placeholder,
  icon,
  value,
  disabled = false,
}) {
  return (
    <TextInput
      is-copy={value ? 'true' : 'false'}
      css={[searchInputRightCss, value && copyInputRightCss]}
      size={'md'}
      rightSection={icon}
      placeholder={placeholder}
      radius={10}
      onClick={onClick}
      value={value && value}
      disabled={disabled}
    />
  );
}

export default SearchFriend;
