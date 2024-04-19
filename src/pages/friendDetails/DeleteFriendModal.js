/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { Button, Group, Modal } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, deleteObject } from 'firebase/storage';

import {
  useSetAddingFriends,
  useUserInfo,
} from '../../components/BirthdayProvider';
import { db } from '../../firebase';

const buttonsContainerCss = css`
  flex-direction: row;
  flex-wrap: nowrap;
`;

/**
 * Displays the Modal for comfirming friend deletion
 * @param {Boolean} isDeleting - true if the modal is open
 * @param {Function} setIsDeleting - updates the state of the modal
 * @param {String} firstName - first name of the friend
 * @param {String} birthdate - birthdate of the friend
 * @param {String} fullName - full name of the friend
 * @param {String} favoriteColor - favorite color of the friend
 * @param {String} id - id of the friend
 * @returns {JSX.Element}
 */
function DeleteFriendModal({
  isDeleting,
  setIsDeleting,
  firstName,
  birthdate,
  fullName,
  favoriteColor,
  id,
}) {
  const [isDeletingFriend, setIsDeletingFriend] = useState(false);
  const { setFriendWasDeleted } = useSetAddingFriends();
  const { userUid } = useUserInfo();
  const navigate = useNavigate();
  const storage = getStorage();

  const handleDelete = () => {
    setIsDeletingFriend(true);

    deleteDoc(doc(db, userUid, id))
      .then(() => {
        navigate('/allFriends');
        setIsDeletingFriend(false);
        setFriendWasDeleted(true);

        // Delete image from storage if friend deleted successfully
        const favoriteColorCapitalized =
          favoriteColor.charAt(0).toUpperCase() + favoriteColor.slice(1);
        const pictureNameFormat = `${userUid}-${birthdate}-${fullName}-${favoriteColorCapitalized}`;
        const desertRef = ref(storage, pictureNameFormat);
        deleteObject(desertRef)
          .then(() => {
            console.log('Image deleted');
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
        setIsDeletingFriend(false);
      });
  };

  return (
    <Modal
      opened={isDeleting}
      onClose={setIsDeleting}
      title='Are you absolutely sure?'
      centered
    >
      <p>
        All data will be lost and the image will be deleted. You won't be able
        to undo this action.
      </p>

      <Group css={buttonsContainerCss} justify='end'>
        <Button
          leftSection={<IconEdit size={20} />}
          className='mt-8'
          variant={'default'}
          onClick={() => setIsDeleting(false)}
        >
          Cancel
        </Button>
        <Button
          leftSection={<IconTrash size={20} />}
          className='mt-8'
          color={'red'}
          onClick={handleDelete}
          loading={isDeletingFriend}
          loaderProps={{ type: 'dots' }}
        >
          Delete {firstName || 'Friend'}
        </Button>
      </Group>
    </Modal>
  );
}

export default DeleteFriendModal;
