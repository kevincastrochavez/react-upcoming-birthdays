import { Modal } from '@mantine/core';
import { t } from 'i18next';

import { useActionFriends, useSetAddingFriends } from '../BirthdayProvider';
import AddForm from './AddForm';

function AddFriend() {
  const { isAddingFriend } = useActionFriends();
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <Modal
      opened={isAddingFriend}
      onClose={setIsAddingFriend}
      title={t('addFriend.title')}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <AddForm />
    </Modal>
  );
}

export default AddFriend;
