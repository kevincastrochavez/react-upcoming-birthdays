/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import { QRCodeSVG } from 'qrcode.react';
import { Share2Icon } from '@radix-ui/react-icons';

import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  Form,
} from '../../componentsShadcn/ui/form';
import { Switch } from '../../componentsShadcn/ui/switch';
import { useSetUserInfo, useUserInfo } from '../BirthdayProvider';
import { Button } from '../../componentsShadcn/ui/button';
import Copy from './Copy';

const shareContainerCss = css`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;
`;

const qrContainerCss = css`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 12px;

  & > svg {
    width: 200px;
    height: 200px;
  }

  & button {
    width: 40px;
    height: 40px;
    justify-self: end;
    align-self: center;

    & svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const idContainerCss = css`
  & > p {
    padding: 0 0 8px 4px;
    margin-top: 40px;
    font-size: 14px;
  }
`;

const idWrapperCss = css`
  background: #ffffff;
  border-radius: 50px;
  padding: 0 12px;
  display: grid;
  grid-template-columns: 80% 20%;
  border: 1px solid lightgray;

  &[is-disabled='true'] {
    background-color: #f1f3f5;
  }

  & p {
    padding: 8px;
    overflow: hidden;
  }

  & button {
    align-self: center;
    justify-self: center;

    & svg {
      width: 24px !important;
    }
  }
`;

function Share() {
  const { isUserSharingList, userUid } = useUserInfo();
  const { setIsUserSharingList } = useSetUserInfo();
  const listUrlToShare = `https://www.happyb.com/shareImport/${userUid}`;

  const form = useForm({
    defaultValues: {
      security_emails: true,
    },
  });

  return (
    <div css={shareContainerCss}>
      <Form {...form}>
        <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm  bg-slate-50 gap-4'>
          <div className='space-y-0.5'>
            <FormLabel>Do you want your Friends list to be sharable?</FormLabel>
            <FormDescription>
              Anybody who you shared your QR code with will be able to import
              any of your friends
            </FormDescription>
          </div>
          <FormControl>
            <Switch
              checked={isUserSharingList}
              onCheckedChange={() => setIsUserSharingList(!isUserSharingList)}
            />
          </FormControl>
        </FormItem>
      </Form>

      <div css={qrContainerCss}>
        {userUid && <QRCodeSVG value={userUid} />}
        <Button className='rounded-full' variant='outline' size='icon'>
          <Share2Icon className='h-4 w-4' />
        </Button>
      </div>

      <div css={idContainerCss}>
        <p>Or share your unique ID:</p>
        <div
          css={idWrapperCss}
          is-disabled={!isUserSharingList ? 'true' : 'false'}
        >
          <p>{listUrlToShare}</p>
          <Copy disabled={!isUserSharingList} listUrlToShare={listUrlToShare} />
        </div>
      </div>
    </div>
  );
}

export default Share;
