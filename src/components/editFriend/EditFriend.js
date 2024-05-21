import React from 'react';
import { Modal } from '@mantine/core';
import { t } from 'i18next';

import EditForm from './EditForm';
import { useActionFriends, useSetAddingFriends } from '../BirthdayProvider';

function EditFriend() {
  const { isEditingFriend } = useActionFriends();
  const { setIsEditingFriend } = useSetAddingFriends();

  return (
    <Modal
      opened={isEditingFriend}
      onClose={setIsEditingFriend}
      title={t('editFriend.title')}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <EditForm />
    </Modal>
  );
}

export default EditFriend;
