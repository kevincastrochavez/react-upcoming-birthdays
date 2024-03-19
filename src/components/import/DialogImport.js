import React from 'react';
import { IconSearch } from '@tabler/icons-react';

import { useSetSearch } from '../BirthdayProvider';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../componentsShadcn/ui/dialog';
import { Input } from '../../componentsShadcn/ui/input';
import { Label } from '../../componentsShadcn/ui/label';
import SearchFriend from '../searchFriend/SearchFriend';
import { Button } from '../../componentsShadcn/ui/button';

/**
 * Displays the Dialog component for the list search
 * @returns {JSX.Element}
 */
function DialogImport() {
  const { setIsIdSearching, setSearchIdText } = useSetSearch();
  const searchIcon = <IconSearch />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SearchFriend
          onClick={() => setIsIdSearching(true)}
          placeholder='KN998HQ8EHD8HDSDASH'
          icon={searchIcon}
        />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Look up your friend's list</DialogTitle>
          <DialogDescription>
            To keep users privacy, we will not show you a list unless you have
            the exact ID of your friend, and the list is public.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-rows-2 items-center'>
            <Label htmlFor='friendId'>Friend's ID</Label>
            <Input
              id='friendId'
              className='row-span-1'
              onChange={(e) => setSearchIdText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className='grid grid-cols-3'>
          <DialogClose asChild className='col-span-1 row-span-1'>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>

          <Button className='col-span-1 col-start-3'>Search</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DialogImport;
