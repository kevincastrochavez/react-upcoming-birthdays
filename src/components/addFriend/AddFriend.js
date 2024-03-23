import { Modal } from '@mantine/core';

import { useAddingFriends, useSetAddingFriends } from '../BirthdayProvider';
import AddForm from './AddForm';

function AddFriend() {
  const { isAddingFriend } = useAddingFriends();
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <Modal
      opened={isAddingFriend}
      onClose={setIsAddingFriend}
      title='Add Friend'
    >
      <AddForm />
    </Modal>
  );
}

export default AddFriend;
