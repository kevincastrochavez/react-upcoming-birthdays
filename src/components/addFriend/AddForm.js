/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import ShortUniqueId from 'short-unique-id';
import { useForm } from '@mantine/form';
import {
  Button,
  FileInput,
  Group,
  Space,
  TextInput,
  Radio,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAbc, IconColorFilter, IconPhoto } from '@tabler/icons-react';

import { useSetAddingFriends, useUserInfo } from '../BirthdayProvider';
import { db } from '../../firebase';

const radioItemCss = css`
  margin-top: 0 !important;
`;

// TODO: Compress image before uploading
function AddForm() {
  const [birthdateValue, setBirthdateValue] = useState(new Date());
  const [candyPreferenceValue, setCandyPreferenceValue] = useState('');
  const [likesToCelebrateValue, setLikesToCelebrateValue] = useState('');
  const [pictureFile, setPictureFile] = useState(null);

  const fullNameIcon = <IconAbc stroke={1.5} />;
  const pictureIcon = <IconPhoto stroke={1.5} />;
  const favoriteColorIcon = <IconColorFilter stroke={1.5} />;

  // Upload picture logic
  const { userUid } = useUserInfo();
  const uid = new ShortUniqueId({ length: 20 });
  const uniqueId = uid.rnd();
  const storage = getStorage();
  const [isUploading, setIsUploading] = useState(false);
  const { setIsAddingFriend } = useSetAddingFriends();
  const pictureRef = ref(storage, uniqueId);

  // Regex functions for validations
  const fullNameRegex = /^[a-zA-Z]{3,20}\s[a-zA-Z]{3,20}$/;
  const colorRegex = /^[a-zA-Z]{3,12}$/;
  const likesToCelebrateRegex = /^(yes|no)$/;
  const candyRegex = /^(sweet|sour)$/;

  const form = useForm({
    initialValues: {
      fullName: '',
      birthday: '',
      pictureUrl: '',
      favoriteColor: '',
      likesToCelebrate: '',
      candyPreference: '',
    },

    // functions will be used to validate values at corresponding key
    validate: {
      fullName: (value) =>
        fullNameRegex.test(value)
          ? null
          : 'Full name must fall in the format "First Last", between 3-20 characters',
      favoriteColor: (value) =>
        colorRegex.test(value)
          ? null
          : 'Color name must be between 3-12 characters',
      likesToCelebrate: (value) =>
        likesToCelebrateRegex.test(value) ? null : 'Must choose an option',
      candyPreference: (value) =>
        candyRegex.test(value) ? null : 'Must choose an option',
    },
  });

  async function onSubmit() {
    const { candyPreference, likesToCelebrate, fullName, favoriteColor } =
      form.values;

    // Format birth date from Date object to format of YYYY-MM-DD
    const birthdayYear = birthdateValue.getFullYear();
    const birthdayMonth = birthdateValue.getMonth();
    const birthdayDay = birthdateValue.getDate();
    const birthdayFull = `${birthdayYear}-${birthdayMonth + 1}-${birthdayDay}`;
    setIsUploading(true);
    let pictureUrl = '';
    // Upload picture to firebase and get url to attach it to friend
    await uploadBytes(pictureRef, pictureFile)
      .then(async (snapshot) => {
        await getDownloadURL(ref(storage, uniqueId))
          .then((url) => {
            console.log('Image uploaded');
            pictureUrl = url;
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error);
          });
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
    // Add friend to firestore collection for the user
    await setDoc(doc(db, userUid, uniqueId), {
      fullName,
      favoriteColor: favoriteColor.toLowerCase(),
      likesToCelebrate,
      candyPreference,
      imageUrl: pictureUrl,
      birthdate: birthdayFull,
    })
      .then((result) => {
        setIsUploading(false);
        setIsAddingFriend(false);
        console.log('Friend added');
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <TextInput
        withAsterisk
        label='Full Name'
        placeholder='Kevin Castro'
        {...form.getInputProps('fullName')}
        leftSection={fullNameIcon}
        name='name'
      />

      <Space h='md' />

      <DatePickerInput
        label="Friend's Birthday"
        placeholder='Date input'
        withAsterisk
        value={birthdateValue}
        onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label="Friend's picture (optional)"
        placeholder='Choose picture'
        clearable
        leftSection={pictureIcon}
        onChange={(imageFile) => setPictureFile(imageFile)}
      />

      <Space h='md' />

      <TextInput
        withAsterisk
        label='Favorite Color'
        placeholder='Blue'
        {...form.getInputProps('favoriteColor')}
        leftSection={favoriteColorIcon}
      />

      <Space h='md' />

      <Radio.Group
        name='candyPreference'
        label='Candy Preference'
        withAsterisk
        value={candyPreferenceValue}
        onChange={setCandyPreferenceValue}
        {...form.getInputProps('candyPreference')}
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
        value={likesToCelebrateValue}
        onChange={setLikesToCelebrateValue}
        {...form.getInputProps('likesToCelebrate')}
      >
        <Group mt='xs'>
          <Radio value='Yes' label='Yes' />
          <Radio value='No' label='No' />
        </Group>
      </Radio.Group>

      <Group justify='flex-end' mt='md'>
        <Button type='submit'>Submit</Button>
      </Group>
    </form>
  );
}

export default AddForm;
