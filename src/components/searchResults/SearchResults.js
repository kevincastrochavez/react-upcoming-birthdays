import { useSearch, useSetSearch } from '../BirthdayProvider';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../componentsShadcn/ui/command';
import { Link } from 'react-router-dom';

/**
 * Displays the ShareResults component, which displays the list of all friends according to user's search
 * @returns {JSX.Element}
 */
function ShareResults() {
  const { friendsFilteredBySearch } = useSearch();
  const { setIsSearching } = useSetSearch();
  const { isSearching } = useSearch();

  return (
    <CommandDialog open={isSearching} onOpenChange={setIsSearching}>
      <CommandInput placeholder="Type your friend's name..." />
      <CommandList>
        <CommandEmpty>No friends found.</CommandEmpty>
        <CommandGroup heading='Results'>
          {friendsFilteredBySearch?.map(
            ({ imageUrl, formattedFullName, id }) => (
              <Link to={`/allFriends/${id}`} key={id}>
                <CommandItem>
                  <img
                    src={imageUrl}
                    className='w-8 h-8 rounded-full mr-2'
                    alt=''
                  />
                  <span>{formattedFullName}</span>
                </CommandItem>
              </Link>
            )
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default ShareResults;
