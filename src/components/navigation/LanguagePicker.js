/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Input, InputBase, Combobox, useCombobox, Group } from '@mantine/core';
import { MXFlag, USFlag, BRFlag } from 'mantine-flagpack';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'EN', icon: <USFlag w={30} /> },
  { value: 'es', label: 'ES', icon: <MXFlag w={30} /> },
  { value: 'pt', label: 'PT-BR', icon: <BRFlag w={30} /> },
];

const comboBoxCss = css`
  width: 100px;

  & button {
    display: flex;
    align-items: center;
  }
`;

const flagContainerCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

function LanguagePicker() {
  const [valueLanguage, setValue] = useState(LANGUAGE_OPTIONS[0]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const options = LANGUAGE_OPTIONS.map(({ value, label, icon }) => {
    return (
      <Combobox.Option
        value={value}
        key={value}
        active={value === valueLanguage}
      >
        <Group gap='xs'>
          <div css={flagContainerCss}>
            {icon} {label}
          </div>
        </Group>
      </Combobox.Option>
    );
  });
  console.log(valueLanguage);

  return (
    <Combobox
      css={comboBoxCss}
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        const languageSelectedObj = LANGUAGE_OPTIONS.find(
          (language) => language.value === val
        );
        setValue(languageSelectedObj);
        combobox.updateSelectedOptionIndex('active');
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target targetType='button'>
        <InputBase
          component='button'
          type='button'
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents='none'
          onClick={() => combobox.toggleDropdown()}
        >
          {valueLanguage.icon || (
            <Input.Placeholder>Pick value</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default LanguagePicker;
