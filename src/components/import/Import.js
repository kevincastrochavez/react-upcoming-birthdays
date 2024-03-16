/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';

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

/**
 * Displays the Import component
 * @returns {JSX.Element}
 */
function Import() {
  const [qrCodeData, setQrCodeData] = useState(null);
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
    </div>
  );
}

export default Import;
