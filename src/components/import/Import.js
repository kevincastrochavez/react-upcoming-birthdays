/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Notification } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';

import { useSetSharing, useSharing } from '../BirthdayProvider';
import DialogImport from './DialogImport';

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

const addedNotificationCss = css`
  position: fixed;
  bottom: 90px;
  left: 24px;
  right: 24px;
  z-index: 10;
`;

/**
 * Displays the Import component
 * @returns {JSX.Element}
 */
function Import() {
  const [qrCodeData, setQrCodeData] = useState(null);
  const { strangeQrCode } = useSharing();
  const { setStrangeQrCode } = useSetSharing();
  const baseUrlApp = 'happyb-five.vercel.app';
  let scanner;

  const closeIcon = <IconX />;

  function checkQrCodeBelongsToApp(qrValue) {
    const qrValueArray = qrValue.split('/');
    let belongsToApp = false;
    if (qrValueArray.length > 4) {
      const appDomain = qrValueArray[2];
      belongsToApp = appDomain === baseUrlApp;
    } else {
      setStrangeQrCode(true);
    }

    return belongsToApp;
  }

  useEffect(() => {
    const onScanSuccess = (decodedText) => {
      const belongsToApp = checkQrCodeBelongsToApp(decodedText);
      if (belongsToApp) {
        setQrCodeData(decodedText);
      }
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

  if (strangeQrCode) {
    setTimeout(() => {
      setStrangeQrCode(false);
    }, 3000);
  }

  return (
    <div css={shareContainerCss}>
      <h1>Got a QR code? Scan it or upload it here!</h1>
      <div css={scannerContainerCss} id='reader'></div>

      <div css={idContainerCss}>
        <p>Or look up your friend’s list by the unique ID</p>

        <DialogImport />
      </div>

      {strangeQrCode && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Looks like this QR Code does not belong to this app'
          withBorder
          onClose={() => setStrangeQrCode(false)}
        />
      )}
    </div>
  );
}

export default Import;
