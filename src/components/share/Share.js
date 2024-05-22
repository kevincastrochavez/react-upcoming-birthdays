/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { QRCodeSVG } from 'qrcode.react';
import { doc, updateDoc } from 'firebase/firestore';
import { Loader, Overlay } from '@mantine/core';
import { t } from 'i18next';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  Form,
} from '../../componentsShadcn/ui/form';
import { Switch } from '../../componentsShadcn/ui/switch';
import {
  useActionFriends,
  useSetAddingFriends,
  useUserInfo,
} from '../BirthdayProvider';
import SearchFriend from '../searchFriend/SearchFriend';
import Copy from './Copy';
import { db } from '../../firebase';

const shareContainerCss = css`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;

  & button[role='switch'][data-state='checked'] {
    background-color: #228be6 !important;
  }
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

  & > div {
    padding: 0;
  }
`;

const loaderCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

/**
 * Displays the Share component
 * @returns {JSX.Element}
 */
function Share() {
  const { isUpdatingSharing } = useActionFriends();
  const { setIsUpdatingSharing, setFetchingListFailed, setListWasUpdated } =
    useSetAddingFriends();
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
    setIsUpdatingSharing(true);
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
      .then(() => {
        setListWasUpdated(true);
        setIsUpdatingSharing(false);
      })
      .catch((error) => {
        setIsUpdatingSharing(false);
        setFetchingListFailed(true);
      });
  }

  return (
    <div css={shareContainerCss}>
      <Form {...form}>
        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm  bg-slate-50 gap-4'>
          <div className='space-y-0.5'>
            <FormLabel>{t('shareImport.share.title')}</FormLabel>
            <FormDescription>{t('shareImport.share.message')}</FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={isUserSharingList}
              onCheckedChange={updateSharing}
            />
          </FormControl>
        </FormItem>
      </Form>

      <div data-tour='shareCode'>
        <div css={qrContainerCss}>
          {isUserSharingList ? (
            <>
              <p>{t('shareImport.share.qrMessage')}</p>
              <QRCodeSVG value={qrCodeToShare} />
            </>
          ) : (
            <p>{t('shareImport.share.qrPublic')}</p>
          )}
        </div>

        <div css={idContainerCss}>
          <p>{t('shareImport.share.directLink')}</p>

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

      {isUpdatingSharing && (
        <>
          <Overlay color='#000' backgroundOpacity={0.85} />
          <Loader css={loaderCss} color='blue' />
        </>
      )}
    </div>
  );
}

export default Share;
