import { Dialog, DialogContent } from '../../componentsShadcn/ui/dialog';

import { useAddingFriends, useSetAddingFriends } from '../BirthdayProvider';
import AddForm from './AddForm';

function AddFriend() {
  const { isAddingFriend } = useAddingFriends();
  const { setIsAddingFriend } = useSetAddingFriends();

  return (
    <Dialog open={isAddingFriend} onOpenChange={setIsAddingFriend}>
      <DialogContent className='sm:max-w-[425px]'>
        <AddForm />
      </DialogContent>
    </Dialog>
  );
}

export default AddFriend;
