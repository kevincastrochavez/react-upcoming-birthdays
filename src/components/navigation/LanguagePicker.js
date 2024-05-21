/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Input, InputBase, Combobox, useCombobox, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_OPTIONS } from '../../lib/constants';
import { useLanguage, useSetLanguage } from '../BirthdayProvider';

const comboBoxCss = css`
  width: 60px;

  & div[data-position='right'] {
    width: 24px;
  }

  & button {
    padding-right: 20px;
    height: 24px;
    display: flex;
    align-items: center;
  }
`;

const flagContainerCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const optionsWrapperCss = css`
  width: 110px !important;
`;

function LanguagePicker() {
  const { languageSelectedObj } = useLanguage();
  const { setLanguageSelectedObj } = useSetLanguage();
  const { i18n } = useTranslation();

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

        i18n.changeLanguage(languageSelectedObj.value);
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

      <Combobox.Dropdown css={optionsWrapperCss}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default LanguagePicker;
