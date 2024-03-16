/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import { TextInput } from '@mantine/core';

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

const idWrapperCss = css`
  & input {
    padding-left: 16px;
    font-size: 14px;
  }

  & svg {
    margin-right: 16px;
  }
`;

/**
 * Displays the Import component
 * @returns {JSX.Element}
 */
function Import() {
  const [qrCodeData, setQrCodeData] = useState(null);
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
        <div css={idWrapperCss}>
          <TextInput
            size={'sm'}
            rightSection={searchIcon}
            placeholder='KN998HQ8EHD8HDSDASH'
            radius={30}
            // onFocus={onSearchInputFocus}
            // onBlur={onSearchInputBlur}
            // onChange={(event) => setSearchText(event.currentTarget.value)}
          />
          <img src={IconSearch} alt='' />
        </div>
      </div>
    </div>
  );
}

export default Import;
