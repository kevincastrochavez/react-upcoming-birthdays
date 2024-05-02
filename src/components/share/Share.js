/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { QRCodeSVG } from 'qrcode.react';
import { Share2Icon } from '@radix-ui/react-icons';
import { doc, updateDoc } from 'firebase/firestore';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  Form,
} from '../../componentsShadcn/ui/form';
import { Switch } from '../../componentsShadcn/ui/switch';
import { useUserInfo } from '../BirthdayProvider';
import { Button } from '../../componentsShadcn/ui/button';
import SearchFriend from '../searchFriend/SearchFriend';
import Copy from './Copy';
import { db } from '../../firebase';

const shareContainerCss = css`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;
`;

const qrContainerCss = css`
  margin-top: 24px;
  display: grid;

  & > p {
    font-size: 14px;
    margin-bottom: 16px;
  }

  & > svg {
    width: 200px;
    height: 200px;
    justify-self: center;
  }
`;

const idContainerCss = css`
  & > p {
    padding: 0 0 8px 4px;
    margin-top: 40px;
    font-size: 14px;
  }
`;

/**
 * Displays the Share component
 * @returns {JSX.Element}
 */
function Share() {
  const { isUserSharingList, userUid } = useUserInfo();
  const baseUrl = 'https://happyb-five.vercel.app/shareImport';
  const qrCodeToShare = `${baseUrl}/${userUid}`;
  const manualIdToShare = `${baseUrl}?listToImport=${userUid}`;

  const form = useForm({
    defaultValues: {
      security_emails: true,
    },
  });

  function updateSharing() {
    const globalCollection = 'friends';
    const personalCollection = userUid;
    const sharedListCollection = 'sharingList';

    updateDoc(
      doc(
        db,
        globalCollection,
        personalCollection,
        sharedListCollection,
        'sharingList'
      ),
      {
        sharing: !isUserSharingList,
      }
    )
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div css={shareContainerCss}>
      <Form {...form}>
        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm  bg-slate-50 gap-4'>
          <div className='space-y-0.5'>
            <FormLabel>Do you want your friends list to be public?</FormLabel>
            <FormDescription>
              Anybody who you share your QR code or unique ID with will be able
              to import any of your friends marked as not private
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={isUserSharingList}
              onCheckedChange={updateSharing}
            />
          </FormControl>
        </FormItem>
      </Form>

      {isUserSharingList && (
        <div css={qrContainerCss}>
          <p>Have your friends scan this QR code:</p>
          <QRCodeSVG value={qrCodeToShare} />
        </div>
      )}

      <div css={idContainerCss}>
        <p>Or share your unique ID:</p>

        <SearchFriend
          value={manualIdToShare}
          disabled={!isUserSharingList}
          icon={
            <Copy
              disabled={!isUserSharingList}
              listUrlToShare={manualIdToShare}
            />
          }
        />
      </div>
    </div>
  );
}

export default Share;
