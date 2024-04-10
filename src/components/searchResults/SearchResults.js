/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { useSearch, useSetSearch } from '../BirthdayProvider';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../componentsShadcn/ui/command';

const searchResultsLinkCss = css`
  & img {
    border-radius: 50%;
    object-fit: cover;
  }

  & > div {
    gap: 8px;
  }
`;

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
              <Link
                to={`/allFriends/${id}`}
                key={id}
                css={searchResultsLinkCss}
              >
                <CommandItem>
                  <LazyLoadImage
                    src={imageUrl}
                    alt={''}
                    width={32}
                    height={32}
                    effect='blur'
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
