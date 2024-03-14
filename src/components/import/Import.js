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

function Import() {
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    const onScanSuccess = (decodedText) => {
      scanner.clear();
      setQrCodeData(decodedText);
    };

    const onScanError = (errorMessage) => {
      console.log(errorMessage);
    };

    const scanner = new Html5QrcodeScanner('reader', {
      fps: 5,
      qrbox: {
        width: 200,
        height: 200,
      },
    });

    scanner.render(onScanSuccess, onScanError);
  }, []);
  console.log(qrCodeData);

  return (
    <div css={shareContainerCss}>
      <h1>Got a QR code? Scan it or upload it here!</h1>
      <div id='reader'></div>
    </div>
  );
}

export default Import;
