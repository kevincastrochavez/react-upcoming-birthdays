/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Input, InputBase, Combobox, useCombobox, Group } from '@mantine/core';

import { LANGUAGE_OPTIONS } from '../../lib/constants';
import { useLanguage, useSetLanguage } from '../BirthdayProvider';

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
  const { languageSelectedObj } = useLanguage();
  const { setLanguageSelectedObj } = useSetLanguage();

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
        active={value === languageSelectedObj}
      >
        <Group gap='xs'>
          <div css={flagContainerCss}>
            {icon} {label}
          </div>
        </Group>
      </Combobox.Option>
    );
  });

  return (
    <Combobox
      css={comboBoxCss}
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        const languageSelectedObj = LANGUAGE_OPTIONS.find(
          (language) => language.value === val
        );
        setLanguageSelectedObj(languageSelectedObj);
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
          {languageSelectedObj.icon || (
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
