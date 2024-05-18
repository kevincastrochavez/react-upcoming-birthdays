import React, { useState } from 'react';
import { Modal } from '@mantine/core';

import EditForm from './EditForm';
import { useActionFriends, useSetAddingFriends } from '../BirthdayProvider';

function EditFriend() {
  const { isEditingFriend } = useActionFriends();
  const { setIsEditingFriend } = useSetAddingFriends();

  return (
    <Modal
      opened={isEditingFriend}
      onClose={setIsEditingFriend}
      title='Edit Friend'
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
