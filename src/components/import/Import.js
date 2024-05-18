/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

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
 * @param {Function} setQrCodeValue - function to set the QR code value
 * @returns {JSX.Element}
 */
function Import({ setQrCodeValue }) {
  let scanner;

  useEffect(() => {
    const onScanSuccess = async (decodedText) => {
      setQrCodeValue(decodedText);
      scanner.clear();
    };

    const onScanError = (errorMessage) => {
      console.log(errorMessage);
    };

    if (!scanner?.getState()) {
      scanner = new Html5QrcodeScanner('reader', {
        fps: 1,
        qrbox: {
          width: 250,
          height: 250,
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
