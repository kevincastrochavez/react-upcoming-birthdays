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
import { useLocation } from 'react-router-dom';

import { useFriends, useSetAddingFriends } from '../BirthdayProvider';
import { getFriendInfo } from '../../pages/friendDetails/FriendDetails';

function EditForm() {
  const { setIsEditingFriend } = useSetAddingFriends();
  const location = useLocation();
  const friendId = location.pathname.split('/')[2];
  const { friendsList: friends } = useFriends();
  const {
    fullName,
    birthdate,
    favoriteColor,
    likesToCelebrate,
    candyPreference,
  } = getFriendInfo(friends, friendId);
  const favoriteColorCapitalized =
    favoriteColor.charAt(0).toUpperCase() + favoriteColor.slice(1);

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
        value={fullName}
      />

      <Space h='md' />

      <DatePickerInput
        label="Friend's Birthday"
        placeholder='Date input'
        withAsterisk
        value={new Date(birthdate)}
        // onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label="Friend's picture (optional)"
        placeholder='Previous picture left unchanged'
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
        value={favoriteColorCapitalized}
      />

      <Space h='md' />

      <Radio.Group
        name='candyPreference'
        label='Candy Preference'
        withAsterisk
        value={candyPreference}
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
        value={likesToCelebrate}
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
