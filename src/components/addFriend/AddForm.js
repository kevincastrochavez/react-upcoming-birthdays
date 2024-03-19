/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { app, db } from '../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import ShortUniqueId from 'short-unique-id';
import { ReloadIcon } from '@radix-ui/react-icons';

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../componentsShadcn/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../componentsShadcn/ui/form';
import {
  RadioGroup,
  RadioGroupItem,
} from '../../componentsShadcn/ui/radio-group';
import { Input } from '../../componentsShadcn/ui/input';
import { Button } from '../../componentsShadcn/ui/button';
import { toast } from '../../componentsShadcn/ui/use-toast';

import { useToast } from '../../componentsShadcn/ui/use-toast';
import { useSetAddingFriends, useUserInfo } from '../BirthdayProvider';

const radioItemCss = css`
  margin-top: 0 !important;
`;

function AddForm() {
  const { userUid } = useUserInfo();
  const uid = new ShortUniqueId({ length: 20 });
  const uniqueId = uid.rnd();
  const storage = getStorage();
  const pictureRef = ref(storage, uniqueId);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const { setIsAddingFriend } = useSetAddingFriends();

  const nameRef = useRef(null);

  const defaultValues = {
    fullName: '',
    favoriteColor: '',
    likesToCelebrate: 'Yes',
    candyPreference: 'Yes',
    pictureUrl: '',
  };

  const form = useForm({
    defaultValues: defaultValues,
  });

  async function onSubmit(data) {
    setIsUploading(true);
    let pictureUrl = '';
    const { favoriteColor, likesToCelebrate, candyPreference, fullName } = data;
    const file = pictureRef.current?.files[0]; // Get picture

    // Upload picture to firebase and get url to attach it to friend
    await uploadBytes(pictureRef, file)
      .then(async (snapshot) => {
        await getDownloadURL(ref(storage, uniqueId))
          .then((url) => {
            pictureUrl = url;
          })
          .catch((error) => {
            toast({
              title: 'Something went wrong!',
              description:
                'We were unable to upload your picture. Please try again later.',
            });
            throw new Error(error);
          });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong!',
          description:
            'We were unable to upload your picture. Please try again later.',
        });
        throw new Error(error);
      });

    // Add friend to firestore collection for the user
    await setDoc(doc(db, userUid, uniqueId), {
      fullName,
      favoriteColor: favoriteColor.toLowerCase(),
      likesToCelebrate,
      candyPreference,
      pictureUrl: pictureUrl,
    })
      .then((result) => {
        setIsUploading(false);
        setIsAddingFriend(false);

        toast({
          variant: 'success',
          title: 'Your friend has been added!',
          description: 'Keep adding more people to your friend list!',
        });
      })
      .catch((error) => {
        toast({
          title: 'Something went wrong!',
          description:
            'We were unable to upload your friend. Please try again later.',
        });
        throw new Error(error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <DialogHeader>
          <DialogTitle>Add a Friend</DialogTitle>
          <DialogDescription>
            Add some of your friend's information here
          </DialogDescription>
        </DialogHeader>
        <FormField
          ref={nameRef}
          control={form.control}
          name='fullName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder='Kevin Castro' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='image'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Friend's Picture</FormLabel>
              <FormControl>
                <Input type='file' ref={pictureRef} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='favoriteColor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Favorite Color</FormLabel>
              <FormControl>
                <Input placeholder='Green' {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='candyPreference'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Candy Preference</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className='flex space-y-1 gap-8'
                >
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='sweet' />
                    </FormControl>
                    <FormLabel className='font-normal'>Sweet</FormLabel>
                  </FormItem>
                  <FormItem
                    css={radioItemCss}
                    className='flex items-center space-x-3 space-y-0 mt-0'
                  >
                    <FormControl>
                      <RadioGroupItem value='sour' />
                    </FormControl>
                    <FormLabel className='font-normal'>Sour</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='likesToCelebrate'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Likes to celebrate?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className='flex space-y-1 gap-8'
                >
                  <FormItem className='flex items-center space-x-3 space-y-0'>
                    <FormControl>
                      <RadioGroupItem value='Yes' />
                    </FormControl>
                    <FormLabel className='font-normal'>Yes</FormLabel>
                  </FormItem>
                  <FormItem
                    css={radioItemCss}
                    className='flex items-center space-x-3 space-y-0 mt-0'
                  >
                    <FormControl>
                      <RadioGroupItem value='No' />
                    </FormControl>
                    <FormLabel className='font-normal'>No</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button disabled={isUploading} type='submit'>
            {!isUploading && 'Add Friend'}
            {isUploading && (
              <>
                <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
                Uploading Friend...
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddForm;
