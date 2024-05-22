/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import {
  Button,
  Checkbox,
  Group,
  Loader,
  Modal,
  Notification,
  Overlay,
  Table,
} from '@mantine/core';
import { IconDownload, IconThumbUp, IconX } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import ShortUniqueId from 'short-unique-id';
import { useTour } from '@reactour/tour';
import { t } from 'i18next';

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
  margin-bottom: 100px;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;

  @media (min-width: 1024px) {
    margin-top: 60px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
`;

const tabsContainerCss = css`
  padding: 12px 24px;
  margin-top: 20px;

  @media (min-width: 600px) {
    max-width: 460px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    max-width: 600px;
    grid-row: 2/3;
    grid-column: 1/-1;
    margin-top: 0;
  }
`;

const addedNotificationCss = css`
  position: fixed;
  top: 90px;
  left: 24px;
  right: 24px;
  z-index: 10;
  max-width: 400px;

  @media (min-width: 600px) {
    left: unset;
    right: 30px;
  }

  @media (min-width: 1024px) {
    right: calc((100% - 1024px) / 2);
  }
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

const loaderCss = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;

/**
 * Displays the ShareImport component page
 * @param {Function} setTourStep - function to set the tour step
 * @returns {JSX.Element}
 */
function ShareImport({ setTourStep }) {
  const [qrCodeValue, setQrCodeValue] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [friendsToDisplay, setFriendsToDisplay] = useState([]);
  const [isLoadingDirectLink, setIsLoadingDirectLink] = useState(false);
  const { setOpenImportModal, setFriendsWereImported } = useSetAddingFriends();
  const { setStrangeQrCode } = useSetSharing();
  const { openImportModal, isFetchingFriends } = useActionFriends();
  const [searchParams] = useSearchParams();
  const isSharingListPublic = useRef(null);
  const { userUid } = useUserInfo();
  const { strangeQrCode } = useSharing();
  const navigate = useNavigate();
  const { setIsOpen } = useTour();
  const baseUrlApp = 'happyb-five.vercel.app';
  const closeIcon = <IconX />;

  const tour = window.localStorage.getItem('tour');

  const openProductTour = () => {
    window.localStorage.setItem('tour', 'true');
    setTourStep(0);
    setIsOpen(true);
  };

  useEffect(() => {
    const copyIdValue = searchParams.get('listToImport');
    const completeUrl = window.location.href;
    // const mockCompleteUrl =
    //   'https://happyb-five.vercel.app/shareImport?listToImport=t7faVsPyIweZ78EWetufYMbnt2Q2'; // For testing

    if (qrCodeValue !== null) {
      handleGetListFromFriend(qrCodeValue, true);
    }

    if (copyIdValue) {
      setIsLoadingDirectLink(true);
      handleGetListFromFriend(completeUrl, false);
      // handleGetListFromFriend(mockCompleteUrl, false); // For testing
    }
  }, [qrCodeValue, searchParams]);

  useEffect(() => {
    setTimeout(() => {
      if (!isFetchingFriends && !tour && openImportModal) {
        openProductTour();
      }
    }, 1500);
  }, []);

  if (strangeQrCode) {
    setTimeout(() => {
      setStrangeQrCode(false);
    }, 3000);
  }

  /**
   * Checks if the friend's list is public
   * @param {String} userId - user ID
   * @returns {Boolean} - true if friend's list is public
   */
  const checkUserIsSharingList = async (userId) => {
    const sharingRef = doc(db, `friends/${userId}/sharingList`, 'sharingList');
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
    const appDomain = qrValueArray[2];
    belongsToApp = appDomain === baseUrlApp;

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
      let userId = '';
      if (comingFromQrCode) {
        userId = qrCodeValue.split('/')[4];
      } else {
        userId = qrCodeValue.split('=')[1];
      }

      const listIsPublic = await checkUserIsSharingList(userId);
      isSharingListPublic.current = listIsPublic;

      const allFriendsToDisplay = [];
      const querySnapshot = await getDocs(
        collection(db, `friends/${userId}/personalFriends`)
      );
      querySnapshot.forEach((doc) => {
        const { isPrivate } = doc.data();
        if (!isPrivate) allFriendsToDisplay.push({ ...doc.data(), id: doc.id });
      });

      setFriendsToDisplay(allFriendsToDisplay);
      setOpenImportModal(true);
      setIsLoadingDirectLink(false);
    } else {
      setStrangeQrCode(true);
      setQrCodeValue(null);
      setIsLoadingDirectLink(false);
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
      if (!tour) {
        openProductTour();
      }
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

    if (!tour) {
      openProductTour();
    }
  }

  const notSharingJsx = (
    <>
      <p>{t('shareImport.notSharing')}</p>
      <Button
        leftSection={<IconThumbUp size={20} />}
        className='mt-8 ml-auto'
        onClick={() => setOpenImportModal(false)}
        css={rightAlignedBtnCss}
      >
        {t('shareImport.notSharingBtn')}
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
            <Table.Th>{t('shareImport.sharingPicture')}</Table.Th>
            <Table.Th>{t('shareImport.sharingName')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group justify='flex-end' mt='xl'>
        <Button onClick={handleCancelImport} variant='default'>
          {t('shareImport.sharingCancel')}
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
          {t('shareImport.sharingImport')}
        </Button>
      </Group>
    </>
  );

  function handleCloseImportModal() {
    setOpenImportModal(false);

    if (!tour) {
      openProductTour();
    }
  }

  return (
    <main css={mainContainerCss}>
      <Breadcrumbs />
      <Tabs css={tabsContainerCss} defaultValue='share' className=''>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='share'>{t('shareImport.shareTitle')}</TabsTrigger>
          <TabsTrigger value='import'>
            {t('shareImport.importTitle')}
          </TabsTrigger>
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
          title={t('notifications.strangeQR')}
          withBorder
          onClose={() => setStrangeQrCode(false)}
        />
      )}

      <Modal
        centered
        opened={openImportModal}
        onClose={handleCloseImportModal}
        title={t('notifications.import')}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        {isSharingListPublic.current ? sharingJsx : notSharingJsx}
      </Modal>
      {isLoadingDirectLink && (
        <>
          <Overlay color='#000' backgroundOpacity={0.85} />
          <Loader css={loaderCss} color='blue' />
        </>
      )}
    </main>
  );
}

export default ShareImport;
