import React, { useState } from 'react';
import {
  Input,
  InputBase,
  Combobox,
  useCombobox,
  CheckIcon,
  Group,
} from '@mantine/core';

function LanguagePicker() {
  const [value, setValue] = useState('🥦 Broccoli');
  const groceries = [
    '🍎 Apples',
    '🍌 Bananas',
    '🥦 Broccoli',
    '🥕 Carrots',
    '🍫 Chocolate',
  ];

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

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item} active={item === value}>
      <Group gap='xs'>
        {item === value && <CheckIcon size={12} />}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      resetSelectionOnOptionHover
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.updateSelectedOptionIndex('active');
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
          {value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

export default LanguagePicker;
