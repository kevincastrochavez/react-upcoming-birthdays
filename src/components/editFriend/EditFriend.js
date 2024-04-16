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
    >
      <EditForm />
    </Modal>
  );
}

export default EditFriend;
