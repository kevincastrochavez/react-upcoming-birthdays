import React, { useState } from 'react';
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
import { useForm } from '@mantine/form';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import Compressor from 'compressorjs';

import {
  useFriends,
  useSetAddingFriends,
  useUserInfo,
} from '../BirthdayProvider';
import { getFriendInfo } from '../../pages/friendDetails/FriendDetails';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function EditForm() {
  const { setIsEditingFriend, setFriendWasUpdated, setUpdatingFriendFailed } =
    useSetAddingFriends();
  const location = useLocation();
  const friendId = location.pathname.split('/')[2];
  const storage = getStorage();
  const { friendsList: friends } = useFriends();
  const {
    fullName,
    birthdate,
    favoriteColor,
    likesToCelebrate,
    candyPreference,
    imageUrl,
  } = getFriendInfo(friends, friendId);
  const [birthdateValue, setBirthdateValue] = useState(new Date(birthdate));
  const [pictureFile, setPictureFile] = useState(null);
  const [isCompressingPicture, setIsCompressingPicture] = useState(false);
  const favoriteColorCapitalized =
    favoriteColor.charAt(0).toUpperCase() + favoriteColor.slice(1);

  // Upload picture logic
  const { userUid } = useUserInfo();
  const [isSaving, setIsSaving] = useState(false);

  const fullNameIcon = <IconAbc stroke={1.5} />;
  const pictureIcon = <IconPhoto stroke={1.5} />;
  const favoriteColorIcon = <IconColorFilter stroke={1.5} />;

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
      fullName,
      birthday: '',
      pictureUrl: '',
      favoriteColor: favoriteColorCapitalized,
      likesToCelebrate,
      candyPreference,
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
    setIsSaving(true);
    const { candyPreference, likesToCelebrate, fullName, favoriteColor } =
      form.values;

    // Format birth date from Date object to format of YYYY-MM-DD
    const birthdayYear = birthdateValue.getFullYear();
    const birthdayMonth = birthdateValue.getMonth();
    const birthdayDay = birthdateValue.getDate();
    const birthdayFull = `${birthdayYear}-${birthdayMonth + 1}-${birthdayDay}`;

    let pictureUrl = imageUrl; // Set previous image url if no new image is selected
    // If new image is selected, upload it to firebase and get url to attach it to friend
    if (pictureFile) {
      const storage = getStorage();
      const pictureNameFormat = `${userUid}-${birthdayFull}-${fullName}-${favoriteColor}`;
      const pictureRef = ref(storage, pictureNameFormat);

      // Upload picture to firebase and get url to attach it to friend
      await uploadBytes(pictureRef, pictureFile)
        .then(async (snapshot) => {
          await getDownloadURL(ref(storage, pictureNameFormat))
            .then((url) => {
              console.log('Image uploaded');
              pictureUrl = url;
            })
            .catch((error) => {
              setIsSaving(false);
              setUpdatingFriendFailed(true);
            });
        })
        .catch((error) => {
          setIsSaving(false);
          setUpdatingFriendFailed(true);
        });
    }

    const globalCollection = 'friends';
    const personalCollection = userUid;
    const friendsCollection = 'personalFriends';

    // Save changes to friend to firestore collection for the user
    await updateDoc(
      doc(
        db,
        globalCollection,
        personalCollection,
        friendsCollection,
        friendId
      ),
      {
        fullName: fullName.trim(),
        favoriteColor: favoriteColor.trim().toLowerCase(),
        likesToCelebrate,
        candyPreference,
        imageUrl: pictureUrl,
        birthdate: birthdayFull,
      }
    )
      .then(() => {
        setIsSaving(false);
        setFriendWasUpdated(true);
        setIsEditingFriend(false);
      })
      .catch((error) => {
        setIsSaving(false);
        setUpdatingFriendFailed(true);
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
        value={new Date(birthdateValue)}
        onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label="Friend's picture (optional)"
        placeholder='Previous picture left unchanged'
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
        {...form.getInputProps('likesToCelebrate')}
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
          loading={isSaving}
          loaderProps={{ type: 'dots' }}
          type='submit'
          disabled={isCompressingPicture}
        >
          Save Changes
        </Button>
      </Group>
    </form>
  );
}

export default EditForm;
