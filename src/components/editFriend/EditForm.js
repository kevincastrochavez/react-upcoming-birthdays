import React, { useRef, useState } from 'react';
import {
  Button,
  FileInput,
  Group,
  Radio,
  Space,
  Switch,
  TextInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAbc, IconColorFilter, IconPhoto } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { useForm } from '@mantine/form';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';
import Compressor from 'compressorjs';
import ShortUniqueId from 'short-unique-id';
import { t } from 'i18next';

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
  const { friendsList: friends } = useFriends();
  const {
    fullName,
    birthdate,
    favoriteColor,
    likesToCelebrate,
    candyPreference,
    imageUrl,
    imagePath,
    isPrivate,
  } = getFriendInfo(friends, friendId);
  const [birthdateValue, setBirthdateValue] = useState(new Date(birthdate));
  const [pictureFile, setPictureFile] = useState(null);
  const imagePathRef = useRef({ old: imagePath, new: imagePath });
  const [isCompressingPicture, setIsCompressingPicture] = useState(false);
  const [friendIsPrivate, setFriendIsPrivate] = useState(isPrivate);
  const favoriteColorCapitalized =
    favoriteColor.charAt(0).toUpperCase() + favoriteColor.slice(1);

  // Upload picture logic
  const { userUid } = useUserInfo();
  const [isSaving, setIsSaving] = useState(false);
  const storage = getStorage();

  const fullNameIcon = <IconAbc stroke={1.5} />;
  const pictureIcon = <IconPhoto stroke={1.5} />;
  const favoriteColorIcon = <IconColorFilter stroke={1.5} />;

  // Regex functions for validations
  const fullNameRegex = /^\s*[a-zA-Z]{2,15}\s+[a-zA-Z]{2,15}\s*$/;
  const colorRegex = /^\s*[a-zA-Z]{3,15}\s*$/;
  const likesToCelebrateRegex = /^(Yes|No)$/;
  const candyRegex = /^(Sweet|Salty)$/;

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
        fullNameRegex.test(value) ? null : t('editFriend.errors.fullName'),
      favoriteColor: (value) =>
        colorRegex.test(value) ? null : t('editFriend.errors.favoriteColor'),
      likesToCelebrate: (value) =>
        likesToCelebrateRegex.test(value)
          ? null
          : t('editFriend.errors.likesToCelebrate'),
      candyPreference: (value) =>
        candyRegex.test(value) ? null : t('editFriend.errors.candyPreference'),
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
      const uid = new ShortUniqueId({ length: 20 });
      const uniqueId = uid.rnd();
      const pictureNameFormat = `${userUid}-${uniqueId}`;
      const pictureRef = ref(storage, pictureNameFormat);
      imagePathRef.current.new = pictureNameFormat;

      // Upload picture to firebase and get url to attach it to friend
      await uploadBytes(pictureRef, pictureFile)
        .then(async (snapshot) => {
          await getDownloadURL(ref(storage, pictureNameFormat))
            .then((url) => {
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
        imagePath: imagePathRef.current.new,
        birthdate: birthdayFull,
        isPrivate: friendIsPrivate,
      }
    )
      .then(() => {
        setIsSaving(false);
        setFriendWasUpdated(true);
        setIsEditingFriend(false);

        if (
          imagePathRef.current.old !== imagePathRef.current.new &&
          imagePathRef.current.old !== ''
        ) {
          deleteObject(ref(storage, imagePathRef.current.old))
            .then(() => {})
            .catch((error) => {});
        }
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
        label={t('editFriend.fullName.label')}
        placeholder='Kevin Castro'
        {...form.getInputProps('fullName')}
        leftSection={fullNameIcon}
        name='name'
        size='md'
      />

      <Space h='md' />

      <DatePickerInput
        label={t('editFriend.datePicker.label')}
        placeholder='Date input'
        withAsterisk
        value={new Date(birthdateValue)}
        onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
        maxDate={new Date()}
        size='md'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label={t('editFriend.picture.label')}
        placeholder={t('editFriend.picture.placeholder')}
        clearable
        leftSection={pictureIcon}
        onChange={handleCompressImage}
        size='md'
      />

      <Space h='md' />

      <TextInput
        withAsterisk
        label={t('editFriend.color.label')}
        placeholder="Your friend's favorite color"
        {...form.getInputProps('favoriteColor')}
        leftSection={favoriteColorIcon}
        size='md'
      />

      <Space h='md' />

      <Radio.Group
        name='candyPreference'
        label={t('editFriend.candy.label')}
        withAsterisk
        {...form.getInputProps('candyPreference')}
        size='md'
      >
        <Group mt='xs'>
          <Radio value='Sweet' label={t('editFriend.candy.sweet')} />
          <Radio value='Salty' label={t('editFriend.candy.salty')} />
        </Group>
      </Radio.Group>

      <Space h='md' />

      <Radio.Group
        name='likesToCelebrate'
        label={t('editFriend.celebrate.label')}
        withAsterisk
        {...form.getInputProps('likesToCelebrate')}
        size='md'
      >
        <Group mt='xs'>
          <Radio value='Yes' label={t('editFriend.celebrate.yes')} />
          <Radio value='No' label={t('editFriend.celebrate.no')} />
        </Group>
      </Radio.Group>

      <Switch
        mt='xl'
        checked={friendIsPrivate}
        label={t('editFriend.private.label')}
        description={t('editFriend.private.description')}
        onChange={(event) => setFriendIsPrivate(event.currentTarget.checked)}
        size='md'
      />

      <Group justify='flex-end' mt='xl'>
        <Button
          onClick={() => setIsEditingFriend(false)}
          variant='default'
          size='md'
          className='mb-4'
        >
          {t('editFriend.cancel')}
        </Button>
        <Button
          loading={isSaving}
          loaderProps={{ type: 'dots' }}
          type='submit'
          disabled={isCompressingPicture}
          size='md'
          className='mb-4'
        >
          {t('editFriend.save')}
        </Button>
      </Group>
    </form>
  );
}

export default EditForm;
