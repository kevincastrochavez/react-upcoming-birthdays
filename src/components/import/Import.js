/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Notification,
  Table,
} from '@mantine/core';
import { IconDownload, IconThumbUp, IconX } from '@tabler/icons-react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import ShortUniqueId from 'short-unique-id';

import {
  useActionFriends,
  useSetAddingFriends,
  useSetSharing,
  useSharing,
  useUserInfo,
} from '../BirthdayProvider';
import DialogImport from './DialogImport';
import { db } from '../../firebase';

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

const rightAlignedBtnCss = css`
  display: flex;
`;

const tableCss = css`
  & td > img {
    border-radius: 50%;
    object-fit: cover;
    width: 40px;
    height: 40px;
  }
`;

/**
 * Displays the Import component
 * @returns {JSX.Element}
 */
function Import() {
  const { openImportModal } = useActionFriends();
  const { setOpenImportModal, setFriendsWereImported } = useSetAddingFriends();
  const [friendsToDisplay, setFriendsToDisplay] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const isSharingListPublic = useRef(null);
  const { userUid } = useUserInfo();
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

  const checkUserIsSharingList = async (qrValue) => {
    const qrUserId = qrValue.split('/')[4];
    const sharingRef = doc(
      db,
      `friends/${qrUserId}/sharingList`,
      'sharingList'
    );
    const sharingSnap = await getDoc(sharingRef);
    const { sharing } = sharingSnap.data();

    return sharing;
  };

  useEffect(() => {
    const onScanSuccess = async (decodedText) => {
      const belongsToApp = checkQrCodeBelongsToApp(decodedText);
      if (belongsToApp) {
        const listIsPublic = await checkUserIsSharingList(decodedText);
        isSharingListPublic.current = listIsPublic;

        const friendToImportId = decodedText.split('/')[4];
        const allFriendsToDisplay = [];
        const querySnapshot = await getDocs(
          collection(db, `friends/${friendToImportId}/personalFriends`)
        );
        querySnapshot.forEach((doc) => {
          allFriendsToDisplay.push({ ...doc.data(), id: doc.id });
        });

        setFriendsToDisplay(allFriendsToDisplay);

        setOpenImportModal(true);
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

  const rows = friendsToDisplay.map((friend) => (
    <Table.Tr key={friend.id}>
      <Table.Td>
        <Checkbox
          aria-label='Select row'
          checked={selectedRows.includes(friend)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, friend]
                : selectedRows.filter(
                    (friendPassed) => friendPassed.id !== friend.id
                  )
            )
          }
        />
      </Table.Td>
      <Table.Td>
        <img src={friend.imageUrl} />
      </Table.Td>
      <Table.Td>{friend.fullName}</Table.Td>
    </Table.Tr>
  ));

  const allRowsAreChecked = selectedRows.length === friendsToDisplay.length;
  const noRowsAreChecked = selectedRows.length === 0;

  const sharingJsx = (
    <>
      {' '}
      <Table css={tableCss}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              {' '}
              <Checkbox
                aria-label='Select all rows'
                checked={allRowsAreChecked && !noRowsAreChecked}
                onChange={(event) =>
                  setSelectedRows(
                    event.currentTarget.checked ? friendsToDisplay : []
                  )
                }
              />
            </Table.Th>
            <Table.Th>Picture</Table.Th>
            <Table.Th>Name</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify='flex-end' mt='xl'>
        <Button onClick={() => setOpenImportModal(false)} variant='default'>
          Cancel
        </Button>
        <Button
          leftSection={<IconDownload size={20} />}
          className='ml-auto'
          onClick={handleFriendsImport}
          css={rightAlignedBtnCss}
          disabled={selectedRows.length < 1}
          loading={isImporting}
          loaderProps={{ type: 'dots' }}
        >
          Import
        </Button>
      </Group>
    </>
  );

  const notSharingJsx = (
    <>
      <p>
        We are sorry. Looks like your friend's list is not public at the moment.
      </p>
      <Button
        leftSection={<IconThumbUp size={20} />}
        className='mt-8 ml-auto'
        onClick={() => setOpenImportModal(false)}
        css={rightAlignedBtnCss}
      >
        Understood
      </Button>
    </>
  );

  if (strangeQrCode) {
    setTimeout(() => {
      setStrangeQrCode(false);
    }, 3000);
  }

  async function handleFriendsImport() {
    setIsImporting(true);
    const storage = getStorage();
    const placeHolderImage =
      'https://firebasestorage.googleapis.com/v0/b/happyb-5c66e.appspot.com/o/user.jpg?alt=media&token=db5411aa-be64-49a1-89d4-b293d202ee7d';

    try {
      await Promise.all(
        selectedRows.map(async (friend) => {
          const {
            fullName,
            favoriteColor,
            birthdate,
            likesToCelebrate,
            candyPreference,
            imagePath,
          } = friend;

          const uid = new ShortUniqueId({ length: 20 });
          const uniqueId = uid.rnd();
          let pictureUrl = '';
          const pictureNameFormat = `${userUid}-${uniqueId}`;

          if (imagePath !== '') {
            const url = await getDownloadURL(ref(storage, imagePath));
            const imageBlob = await fetch(url).then((res) => res.blob());
            const imageRef = ref(storage, pictureNameFormat);
            await uploadBytes(imageRef, imageBlob);
            pictureUrl = await getDownloadURL(ref(storage, pictureNameFormat));
          }

          const imageUrl = pictureUrl || placeHolderImage;

          const globalCollection = 'friends';
          const personalCollection = userUid;
          const friendsCollection = 'personalFriends';

          setDoc(
            doc(
              db,
              globalCollection,
              personalCollection,
              friendsCollection,
              uniqueId
            ),
            {
              fullName,
              favoriteColor,
              likesToCelebrate,
              candyPreference,
              imageUrl,
              imagePath: pictureNameFormat,
              birthdate: birthdate,
            }
          );
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsImporting(false);
      setOpenImportModal(false);
      setFriendsWereImported(true);
    }
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

      <Modal
        centered
        opened={openImportModal}
        onClose={() => setOpenImportModal(false)}
        title='Import your friends list'
      >
        {isSharingListPublic.current ? sharingJsx : notSharingJsx}
      </Modal>
    </div>
  );
}

export default Import;
