/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import ShortUniqueId from 'short-unique-id';
import { useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';
import { DateInput, DatesProvider } from '@mantine/dates';

import { useSetAddingFriends, useUserInfo } from '../BirthdayProvider';
import { app, db } from '../../firebase';

const radioItemCss = css`
  margin-top: 0 !important;
`;

function AddForm() {
  const [birthdate, setBirthdate] = useState(new Date());
  const fullNameRef = useRef(null);
  const birthdayRef = useRef(null);
  const favoriteColorRef = useRef(null);
  const likesToCelebrateRef = useRef(null);
  const candyPreferenceRef = useRef(null);

  console.log(birthdate);

  // Upload picture logic
  const { userUid } = useUserInfo();
  const uid = new ShortUniqueId({ length: 20 });
  const uniqueId = uid.rnd();
  const storage = getStorage();
  const pictureRef = ref(storage, uniqueId);
  const [isUploading, setIsUploading] = useState(false);
  const { setIsAddingFriend } = useSetAddingFriends();

  const form = useForm({
    initialValues: {
      fullName: '',
      birthday: '',
      pictureUrl: '',
      favoriteColor: '',
      likesToCelebrate: '',
      candyPreference: '',
    },

    validate: {
      fullName: (value) =>
        value.length < 2 ? 'First name is too short' : null,
    },
  });

  async function onSubmit(e) {
    e.preventDefault();
    console.log(form.values);
    // setIsUploading(true);
    // let pictureUrl = '';
    // const { favoriteColor, likesToCelebrate, candyPreference, fullName } = data;
    // const file = pictureRef.current?.files[0]; // Get picture
    // // Upload picture to firebase and get url to attach it to friend
    // await uploadBytes(pictureRef, file)
    //   .then(async (snapshot) => {
    //     await getDownloadURL(ref(storage, uniqueId))
    //       .then((url) => {
    //         pictureUrl = url;
    //       })
    //       .catch((error) => {
    //         toast({
    //           title: 'Something went wrong!',
    //           description:
    //             'We were unable to upload your picture. Please try again later.',
    //         });
    //         throw new Error(error);
    //       });
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: 'Something went wrong!',
    //       description:
    //         'We were unable to upload your picture. Please try again later.',
    //     });
    //     throw new Error(error);
    //   });
    // // Add friend to firestore collection for the user
    // await setDoc(doc(db, userUid, uniqueId), {
    //   fullName,
    //   favoriteColor: favoriteColor.toLowerCase(),
    //   likesToCelebrate,
    //   candyPreference,
    //   pictureUrl: pictureUrl,
    // })
    //   .then((result) => {
    //     setIsUploading(false);
    //     setIsAddingFriend(false);
    //     toast({
    //       variant: 'success',
    //       title: 'Your friend has been added!',
    //       description: 'Keep adding more people to your friend list!',
    //     });
    //   })
    //   .catch((error) => {
    //     toast({
    //       title: 'Something went wrong!',
    //       description:
    //         'We were unable to upload your friend. Please try again later.',
    //     });
    //     throw new Error(error);
    //   });
  }

  function setFormValues() {
    form.setValues({
      fullName: fullNameRef.current?.value,
      birthday: birthdayRef.current?.value,
      pictureUrl: '',
      favoriteColor: '',
      likesToCelebrate: '',
      candyPreference: '',
    });
  }

  return (
    <DatesProvider settings={{}}>
      <form onSubmit={onSubmit}>
        <TextInput
          ref={fullNameRef}
          withAsterisk
          label='Full Name'
          placeholder='Kevin Castro'
          {...form.getInputProps('fullName')}
        />

        <DateInput
          value={birthdate}
          onChange={setBirthdate}
          label="Friend's Birthday"
          placeholder='Date input'
          valueFormat='YYYY MMM DD'
        />

        {/* <Group justify='flex-end' mt='md'>
        <Button onClick={setFormValues} type='submit'>
        Submit
        </Button>
      </Group> */}
      </form>
    </DatesProvider>
  );
}

export default AddForm;
