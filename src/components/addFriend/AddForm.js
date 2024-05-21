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
  Switch,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconAbc, IconColorFilter, IconPhoto } from '@tabler/icons-react';
import Compressor from 'compressorjs';
import { t } from 'i18next';

import { useSetAddingFriends, useUserInfo } from '../BirthdayProvider';
import { db } from '../../firebase';

function AddForm() {
  const [birthdateValue, setBirthdateValue] = useState(new Date());
  const [candyPreferenceValue, setCandyPreferenceValue] = useState('');
  const [likesToCelebrateValue, setLikesToCelebrateValue] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [isCompressingPicture, setIsCompressingPicture] = useState(false);
  const [friendIsPrivate, setFriendIsPrivate] = useState(false);

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

    let pictureNameFormat = '';

    if (pictureFile) {
      // Upload picture to firebase and get url to attach it to friend
      pictureNameFormat = `${userUid}-${uniqueId}`;
      const pictureRef = ref(storage, pictureNameFormat);
      await uploadBytes(pictureRef, pictureFile)
        .then(async (snapshot) => {
          await getDownloadURL(ref(storage, pictureNameFormat))
            .then((url) => {
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

    const globalCollection = 'friends';
    const personalCollection = userUid;
    const friendsCollection = 'personalFriends';

    // Add friend to firestore collection for the user
    await setDoc(
      doc(
        db,
        globalCollection,
        personalCollection,
        friendsCollection,
        uniqueId
      ),
      {
        fullName: fullName.trim(),
        favoriteColor: favoriteColor.trim().toLowerCase(),
        likesToCelebrate,
        candyPreference,
        imageUrl: pictureUrl || placeHolderImage,
        imagePath: pictureNameFormat,
        birthdate: birthdayFull,
        isPrivate: friendIsPrivate,
      }
    )
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
        label={t('addFriend.fullName.label')}
        placeholder={t('addFriend.fullName.placeholder')}
        {...form.getInputProps('fullName')}
        leftSection={fullNameIcon}
        name='name'
        size='md'
      />

      <Space h='md' />

      <DatePickerInput
        label={t('addFriend.datePicker.label')}
        placeholder={t('addFriend.datePicker.placeholder')}
        withAsterisk
        value={birthdateValue}
        onChange={setBirthdateValue}
        valueFormat='YYYY MMM DD'
        defaultLevel='decade'
        maxDate={new Date()}
        size='md'
      />

      <Space h='md' />

      <FileInput
        accept='image/png,image/jpeg,image/jpg'
        label={t('addFriend.picture.label')}
        placeholder={t('addFriend.picture.placeholder')}
        clearable
        leftSection={pictureIcon}
        onChange={handleCompressImage}
        size='md'
      />

      <Space h='md' />

      <TextInput
        withAsterisk
        label={t('addFriend.color.label')}
        placeholder={t('addFriend.color.placeholder')}
        {...form.getInputProps('favoriteColor')}
        leftSection={favoriteColorIcon}
        size='md'
      />

      <Space h='md' />

      <Radio.Group
        name='candyPreference'
        label={t('addFriend.candy.label')}
        withAsterisk
        value={candyPreferenceValue}
        onChange={setCandyPreferenceValue}
        {...form.getInputProps('candyPreference')}
        size='md'
      >
        <Group mt='xs'>
          <Radio value='Sweet' label={t('addFriend.candy.sweet')} />
          <Radio value='Salty' label={t('addFriend.candy.salty')} />
        </Group>
      </Radio.Group>

      <Space h='md' />

      <Radio.Group
        name='likesToCelebrate'
        label={t('addFriend.celebrate.label')}
        withAsterisk
        value={likesToCelebrateValue}
        onChange={setLikesToCelebrateValue}
        {...form.getInputProps('likesToCelebrate')}
        size='md'
      >
        <Group mt='xs'>
          <Radio value='Yes' label={t('addFriend.celebrate.yes')} />
          <Radio value='No' label={t('addFriend.celebrate.no')} />
        </Group>
      </Radio.Group>

      <Switch
        mt='xl'
        label={t('addFriend.private.label')}
        description={t('addFriend.private.description')}
        onChange={(event) => setFriendIsPrivate(event.currentTarget.checked)}
        size='md'
      />

      <Group justify='flex-end' mt='xl'>
        <Button
          onClick={() => setIsAddingFriend(false)}
          variant='default'
          size='md'
          className='mb-4'
        >
          {t('addFriend.cancel')}
        </Button>
        <Button
          loading={isUploading}
          loaderProps={{ type: 'dots' }}
          type='submit'
          disabled={isCompressingPicture}
          size='md'
          className='mb-4'
        >
          {t('addFriend.save')}
        </Button>
      </Group>
    </form>
  );
}

export default AddForm;
