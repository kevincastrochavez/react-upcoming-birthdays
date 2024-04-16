import React from 'react';
import {
  Button,
  FileInput,
  Group,
  Radio,
  Space,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAbc, IconColorFilter, IconPhoto } from '@tabler/icons-react';

import { useSetAddingFriends } from '../BirthdayProvider';

function EditForm() {
  const { setIsEditingFriend } = useSetAddingFriends();

  const fullNameIcon = <IconAbc stroke={1.5} />;
  const pictureIcon = <IconPhoto stroke={1.5} />;
  const favoriteColorIcon = <IconColorFilter stroke={1.5} />;

  return (
    <form>
      <TextInput
        withAsterisk
        label='Full Name'
        placeholder='Kevin Castro'
        // {...form.getInputProps('fullName')}
        leftSection={fullNameIcon}
        name='name'
      />

      <Space h='md' />

      <DatePickerInput
        label="Friend's Birthday"
        placeholder='Date input'
        withAsterisk
        // value={birthdateValue}
        // onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label="Friend's picture (optional)"
        placeholder='Choose picture'
        clearable
        leftSection={pictureIcon}
        // onChange={handleCompressImage}
      />

      <Space h='md' />

      <TextInput
        withAsterisk
        label='Favorite Color'
        placeholder='Blue'
        // {...form.getInputProps('favoriteColor')}
        leftSection={favoriteColorIcon}
      />

      <Space h='md' />

      <Radio.Group
        name='candyPreference'
        label='Candy Preference'
        withAsterisk
        // value={candyPreferenceValue}
        // onChange={setCandyPreferenceValue}
        // {...form.getInputProps('candyPreference')}
      >
        <Group mt='xs'>
          <Radio value='Sweet' label='Sweet' />
          <Radio value='Sour' label='Sour' />
        </Group>
      </Radio.Group>

      <Space h='md' />

      <Radio.Group
        name='likesToCelebrate'
        label='Likes To Celebrate'
        withAsterisk
        // value={likesToCelebrateValue}
        // onChange={setLikesToCelebrateValue}
        // {...form.getInputProps('likesToCelebrate')}
      >
        <Group mt='xs'>
          <Radio value='Yes' label='Yes' />
          <Radio value='No' label='No' />
        </Group>
      </Radio.Group>

      <Group justify='flex-end' mt='xl'>
        <Button onClick={() => setIsEditingFriend(false)} variant='default'>
          Cancel
        </Button>
        <Button
          // loading={isUploading}
          loaderProps={{ type: 'dots' }}
          type='submit'
          // disabled={isCompressingPicture}
        >
          Save Friend
        </Button>
      </Group>
    </form>
  );
}

export default EditForm;
