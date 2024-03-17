/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../componentsShadcn/ui/dialog';
import { Input } from '../../componentsShadcn/ui/input';
import { Label } from '../../componentsShadcn/ui/label';
import SearchFriend from '../searchFriend/SearchFriend';
import { useSetSearch } from '../BirthdayProvider';
import { Button } from '../../componentsShadcn/ui/button';

const shareContainerCss = css`
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  margin-top: 16px;
`;

const scannerContainerCss = css`
  #reader__scan_region {
    display: grid;
    place-items: center;
  }

  #reader__dashboard button {
    padding: 4px 16px;
    border-radius: 8px;
    border: 1px solid black;
    margin-bottom: 12px;
    margin-top: 30px;
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
 * Displays the Import component
 * @returns {JSX.Element}
 */
function Import() {
  const [qrCodeData, setQrCodeData] = useState(null);
  const { setIsIdSearching, setSearchIdText } = useSetSearch();
  const searchIcon = <IconSearch />;
  let scanner;

  useEffect(() => {
    const onScanSuccess = (decodedText) => {
      setQrCodeData(decodedText);
      scanner.clear();
    };

    const onScanError = (errorMessage) => {
      console.log(errorMessage);
    };

    if (!scanner?.getState()) {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 1,
        qrbox: {
          width: 200,
          height: 200,
        },
      });

      scanner.render(onScanSuccess, onScanError);
    }
  }, []);

  return (
    <div css={shareContainerCss}>
      <h1>Got a QR code? Scan it or upload it here!</h1>
      <div css={scannerContainerCss} id='reader'></div>

      <div css={idContainerCss}>
        <p>Or look up your friend’s list by the unique ID</p>

        <Dialog>
          <DialogTrigger asChild>
            <SearchFriend
              onClick={() => setIsIdSearching(true)}
              placeholder='KN998HQ8EHD8HDSDASH'
              icon={searchIcon}
            />
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px]'>
            <DialogHeader>
              <DialogTitle>Look up your friend's list</DialogTitle>
              <DialogDescription>
                To keep users privacy, we will not show you a list unless you
                have the exact ID of your friend, and the list is public.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-6 items-center gap-4'>
                <Label htmlFor='friendId' className='text-right'>
                  ID
                </Label>
                <Input
                  id='friendId'
                  className='col-span-5'
                  onChange={(e) => setSearchIdText(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className='grid grid-cols-3'>
              <DialogClose asChild className='col-span-1 row-span-1'>
                <Button variant='secondary'>Cancel</Button>
              </DialogClose>

              <Button className='col-span-1 col-start-3'>Search</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default Import;
