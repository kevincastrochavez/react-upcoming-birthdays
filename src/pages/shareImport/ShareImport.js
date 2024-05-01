/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import {
  Button,
  Checkbox,
  Group,
  Modal,
  Notification,
  Table,
} from '@mantine/core';
import { IconDownload, IconThumbUp, IconX } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import ShortUniqueId from 'short-unique-id';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../componentsShadcn/ui/tabs';
import Breadcrumbs from './../../components/breadcrumbs/Breadcrumbs';
import Share from '../../components/share/Share';
import Import from '../../components/import/Import';
import {
  useActionFriends,
  useSetAddingFriends,
  useSetSharing,
  useSharing,
  useUserInfo,
} from '../../components/BirthdayProvider';
import { db } from '../../../src/firebase';

const mainContainerCss = css`
  padding: 12px 24px 24px 24px;
  margin-bottom: 100px;
`;

const tabsContainerCss = css`
  margin-top: 30px;
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
 * Displays the ShareImport component page
 * @returns {JSX.Element}
 */
function ShareImport() {
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [friendsToDisplay, setFriendsToDisplay] = useState([]);
  const { setOpenImportModal, setFriendsWereImported } = useSetAddingFriends();
  const { setStrangeQrCode } = useSetSharing();
  const { openImportModal } = useActionFriends();
  const [searchParams, setSearchParams] = useSearchParams();
  const isSharingListPublic = useRef(null);
  const { userUid } = useUserInfo();
  const { strangeQrCode } = useSharing();
  const navigate = useNavigate();
  const baseUrlApp = 'happyb-five.vercel.app';
  const closeIcon = <IconX />;

  useEffect(() => {
    if (qrCodeValue !== null) {
      handleGetListFromFriend(qrCodeValue, true);
    }
  }, [qrCodeValue]);

  if (strangeQrCode) {
    setTimeout(() => {
      setStrangeQrCode(false);
    }, 3000);
  }

  /**
   * Checks if the friend's list is public
   * @param {String} qrCodeValue - QR code value
   * @returns {Boolean} - true if friend's list is public
   */
  const checkUserIsSharingList = async (qrCodeValue) => {
    const qrUserId = qrCodeValue.split('/')[4];
    const sharingRef = doc(
      db,
      `friends/${qrUserId}/sharingList`,
      'sharingList'
    );
    const sharingSnap = await getDoc(sharingRef);
    const { sharing } = sharingSnap.data();

    return sharing;
  };

  /**
   * Checks if the QR code belongs to the app
   * @param {String} qrCodeValue - QR code value
   * @returns {Boolean} - true if belongs to the app
   */
  function checkQrCodeBelongsToApp(qrCodeValue) {
    const qrValueArray = qrCodeValue.split('/');
    let belongsToApp = false;

    if (qrValueArray.length > 4) {
      const appDomain = qrValueArray[2];
      belongsToApp = appDomain === baseUrlApp;
    }

    return belongsToApp;
  }

  /**
   * Gets the list of friends from the QR code or the friend's id
   * @param {String} qrCodeValue - QR code value
   * @param {Boolean} comingFromQrCode - true if coming from QR code
   * @returns {JSX.Element}
   */
  async function handleGetListFromFriend(qrCodeValue, comingFromQrCode) {
    const belongsToApp = checkQrCodeBelongsToApp(qrCodeValue);
    if (belongsToApp) {
      const listIsPublic = await checkUserIsSharingList(qrCodeValue);
      isSharingListPublic.current = listIsPublic;
      let friendToImportId = '';

      if (comingFromQrCode) {
        friendToImportId = qrCodeValue.split('/')[4];
      }

      const allFriendsToDisplay = [];
      const querySnapshot = await getDocs(
        collection(db, `friends/${friendToImportId}/personalFriends`)
      );
      querySnapshot.forEach((doc) => {
        allFriendsToDisplay.push({ ...doc.data(), id: doc.id });
      });

      setFriendsToDisplay(allFriendsToDisplay);
      setOpenImportModal(true);
    } else {
      setStrangeQrCode(true);
      setQrCodeValue(null);
    }
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
      setQrCodeValue(null);
      navigate('/allFriends');
    }
  }

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

  function handleCancelImport() {
    setQrCodeValue(null);
    setOpenImportModal(false);
  }

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
        <Button onClick={handleCancelImport} variant='default'>
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

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <Tabs css={tabsContainerCss} defaultValue='share' className=''>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='share'>Share my List</TabsTrigger>
          <TabsTrigger value='import'>Import a List</TabsTrigger>
        </TabsList>
        <TabsContent value='share'>
          <Share />
        </TabsContent>
        <TabsContent value='import'>
          <Import setQrCodeValue={setQrCodeValue} />
        </TabsContent>
      </Tabs>

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
    </main>
  );
}

export default ShareImport;
