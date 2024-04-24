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
import Compressor from 'compressorjs';

import { useSetAddingFriends, useUserInfo } from '../BirthdayProvider';
import { db } from '../../firebase';

function AddForm() {
  const [birthdateValue, setBirthdateValue] = useState(new Date());
  const [candyPreferenceValue, setCandyPreferenceValue] = useState('');
  const [likesToCelebrateValue, setLikesToCelebrateValue] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [isCompressingPicture, setIsCompressingPicture] = useState(false);

  const fullNameIcon = <IconAbc stroke={1.5} />;
  const pictureIcon = <IconPhoto stroke={1.5} />;
  const favoriteColorIcon = <IconColorFilter stroke={1.5} />;

  // Upload picture logic
  const { userUid } = useUserInfo();
  const uid = new ShortUniqueId({ length: 20 });
  const uniqueId = uid.rnd();
  const storage = getStorage();
  const [isUploading, setIsUploading] = useState(false);
  const { setIsAddingFriend, setFriendWasAdded, setAddingFriendFailed } =
    useSetAddingFriends();
  const placeHolderImage =
    'https://firebasestorage.googleapis.com/v0/b/happyb-5c66e.appspot.com/o/user.jpg?alt=media&token=db5411aa-be64-49a1-89d4-b293d202ee7d';

  // Regex functions for validations
  const fullNameRegex = /^\s*[a-zA-Z]{2,15}\s+[a-zA-Z]{2,15}\s*$/;
  const colorRegex = /^\s*[a-zA-Z]{3,15}\s*$/;
  const likesToCelebrateRegex = /^(Yes|No)$/;
  const candyRegex = /^(Sweet|Sour)$/;

  const handleCompressImage = (imageFile) => {
    setIsCompressingPicture(true);
    new Compressor(imageFile, {
      width: 300,
      height: 300,
      resize: 'cover',
      quality: 0.3,
      convertTypes: ['image/png', 'image/webp', 'image/jpeg', 'image/jpg'],
      success: (compressedResult) => {
        setPictureFile(compressedResult);
        setIsCompressingPicture(false);
      },
      error(err) {
        console.log(err);
        console.log('Image compression failed');
        setIsCompressingPicture(false);
      },
    });
  };

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
          : 'Full name must fall in the format "First Last", between 2-15 letters each. No special characters allowed',
      favoriteColor: (value) =>
        colorRegex.test(value)
          ? null
          : 'Color name must be between 3-15 letters',
      likesToCelebrate: (value) =>
        likesToCelebrateRegex.test(value) ? null : 'Must choose an option',
      candyPreference: (value) =>
        candyRegex.test(value) ? null : 'Must choose an option',
    },
  });

  async function onSubmit() {
    setIsUploading(true);
    const { candyPreference, likesToCelebrate, fullName, favoriteColor } =
      form.values;

    // Format birth date from Date object to format of YYYY-MM-DD
    const birthdayYear = birthdateValue.getFullYear();
    const birthdayMonth = birthdateValue.getMonth();
    const birthdayDay = birthdateValue.getDate();
    const birthdayFull = `${birthdayYear}-${birthdayMonth + 1}-${birthdayDay}`;
    let pictureUrl = '';

    if (pictureFile) {
      // Upload picture to firebase and get url to attach it to friend
      const pictureNameFormat = `${userUid}-${birthdayFull}-${fullName}-${favoriteColor}`;
      const pictureRef = ref(storage, pictureNameFormat);
      await uploadBytes(pictureRef, pictureFile)
        .then(async (snapshot) => {
          await getDownloadURL(ref(storage, pictureNameFormat))
            .then((url) => {
              console.log('Image uploaded');
              pictureUrl = url;
            })
            .catch((error) => {
              setIsUploading(false);
              setAddingFriendFailed(true);
            });
        })
        .catch((error) => {
          setIsUploading(false);
          setAddingFriendFailed(true);
        });
    }

    // Add friend to firestore collection for the user
    await setDoc(doc(db, userUid, uniqueId), {
      fullName: fullName.trim(),
      favoriteColor: favoriteColor.trim().toLowerCase(),
      likesToCelebrate,
      candyPreference,
      imageUrl: pictureUrl || placeHolderImage,
      birthdate: birthdayFull,
    })
      .then(() => {
        setIsUploading(false);
        setFriendWasAdded(true);
        setIsAddingFriend(false);
      })
      .catch((error) => {
        setIsUploading(false);
        setAddingFriendFailed(true);
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
        onChange={handleCompressImage}
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

      <Group justify='flex-end' mt='xl'>
        <Button onClick={() => setIsAddingFriend(false)} variant='default'>
          Cancel
        </Button>
        <Button
          loading={isUploading}
          loaderProps={{ type: 'dots' }}
          type='submit'
          disabled={isCompressingPicture}
        >
          Save Friend
        </Button>
      </Group>
    </form>
  );
}

export default AddForm;
