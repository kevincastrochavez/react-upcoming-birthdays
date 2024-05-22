/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Button, Group, Modal } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { t } from 'i18next';

import {
  useSetAddingFriends,
  useUserInfo,
} from '../../components/BirthdayProvider';
import { db } from '../../firebase';

const modalContainerCss = css`
  & p {
    font-size: 14px;
    color: #857e7e;
  }
`;

const buttonsContainerCss = css`
  flex-direction: row;
  flex-wrap: nowrap;
`;

/**
 * Displays the Modal for comfirming friend deletion
 * @param {Boolean} isDeleting - true if the modal is open
 * @param {Function} setIsDeleting - updates the state of the modal
 * @param {String} firstName - first name of the friend
 * @param {String} id - id of the friend
 * @param {String} imagePath - image path of the friend linked to firebase storage
 * @returns {JSX.Element}
 */
function DeleteFriendModal({
  isDeleting,
  setIsDeleting,
  firstName,
  id,
  imagePath,
}) {
  const [isDeletingFriend, setIsDeletingFriend] = useState(false);
  const { setFriendWasDeleted, setDeletingFriendFailed } =
    useSetAddingFriends();
  const { userUid } = useUserInfo();
  const navigate = useNavigate();
  const storage = getStorage();

  const handleDelete = () => {
    setIsDeletingFriend(true);

    const globalCollection = 'friends';
    const personalCollection = userUid;
    const friendsCollection = 'personalFriends';

    deleteDoc(
      doc(db, globalCollection, personalCollection, friendsCollection, id)
    )
      .then(() => {
        navigate('/allFriends');
        setIsDeletingFriend(false);
        setFriendWasDeleted(true);

        // Delete image from storage if friend deleted successfully
        if (imagePath !== '') {
          const desertRef = ref(storage, imagePath);
          deleteObject(desertRef)
            .then(() => {})
            .catch((error) => {
              setDeletingFriendFailed(true);
            });
        }
      })
      .catch((error) => {
        setIsDeletingFriend(false);
        setDeletingFriendFailed(true);
      });
  };

  return (
    <Modal
      opened={isDeleting}
      onClose={setIsDeleting}
      title={t('deleteFriend.title')}
      centered
      css={modalContainerCss}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <p>{t('deleteFriend.message')}</p>

      <Group css={buttonsContainerCss} justify='end'>
        <Button
          leftSection={<IconEdit size={20} />}
          className='mt-8'
          variant={'default'}
          onClick={() => setIsDeleting(false)}
        >
          {t('deleteFriend.cancel')}
        </Button>
        <Button
          leftSection={<IconTrash size={20} />}
          className='mt-8'
          color={'red'}
          onClick={handleDelete}
          loading={isDeletingFriend}
          loaderProps={{ type: 'dots' }}
        >
          {t('deleteFriend.delete')} {firstName || 'Friend'}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteFriendModal;
