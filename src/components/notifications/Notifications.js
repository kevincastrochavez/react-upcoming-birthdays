/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import { useActionFriends, useSetAddingFriends } from '../BirthdayProvider';

const addedNotificationCss = css`
  position: fixed;
  bottom: 90px;
  left: 24px;
  right: 24px;
  z-index: 10;
`;

function Notifications() {
  const {
    friendWasAdded,
    friendWasDeleted,
    friendWasUpdated,
    addingFriendFailed,
    updatingFriendFailed,
    deletingFriendFailed,
    friendsWereImported,
    importingFriendsFailed,
    fetchingListFailed,
    listWasUpdated,
  } = useActionFriends();

  const {
    setFriendWasAdded,
    setFriendWasDeleted,
    setFriendWasUpdated,
    setAddingFriendFailed,
    setUpdatingFriendFailed,
    setDeletingFriendFailed,
    setFriendsWereImported,
    setImportingFriendsFailed,
    setFetchingListFailed,
    setListWasUpdated,
  } = useSetAddingFriends();

  const checkIcon = <IconCheck />;
  const closeIcon = <IconX />;

  if (friendWasAdded) {
    setTimeout(() => {
      setFriendWasAdded(false);
    }, 3000);
  }

  if (friendWasUpdated) {
    setTimeout(() => {
      setFriendWasUpdated(false);
    }, 3000);
  }

  if (friendWasDeleted) {
    setTimeout(() => {
      setFriendWasDeleted(false);
    }, 3000);
  }

  if (addingFriendFailed) {
    setTimeout(() => {
      setAddingFriendFailed(false);
    }, 3000);
  }

  if (updatingFriendFailed) {
    setTimeout(() => {
      setUpdatingFriendFailed(false);
    }, 3000);
  }

  if (deletingFriendFailed) {
    setTimeout(() => {
      setDeletingFriendFailed(false);
    }, 3000);
  }

  if (friendsWereImported) {
    setTimeout(() => {
      setFriendsWereImported(false);
    }, 3000);
  }

  if (importingFriendsFailed) {
    setTimeout(() => {
      setImportingFriendsFailed(false);
    }, 3000);
  }

  if (fetchingListFailed) {
    setTimeout(() => {
      setFetchingListFailed(false);
    }, 3000);
  }

  if (listWasUpdated) {
    setTimeout(() => {
      setListWasUpdated(false);
    }, 3000);
  }

  return (
    <>
      {friendWasAdded && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friend was successfully added'
          withBorder
          onClose={() => setFriendWasAdded(false)}
        />
      )}

      {friendWasUpdated && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friend was successfully updated'
          withBorder
          onClose={() => setFriendWasUpdated(false)}
        />
      )}

      {friendWasDeleted && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friend was successfully deleted'
          withBorder
          onClose={() => setFriendWasDeleted(false)}
        />
      )}

      {friendsWereImported && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your friends were successfully imported'
          withBorder
          onClose={() => setFriendsWereImported(false)}
        />
      )}

      {listWasUpdated && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title='Your list status was successfully updated'
          withBorder
          onClose={() => setListWasUpdated(false)}
        />
      )}

      {addingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Something went wrong while adding your friend. Please try again later.'
          withBorder
          onClose={() => setAddingFriendFailed(false)}
        />
      )}

      {updatingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Something went wrong while updating your friend. Please try again later.'
          withBorder
          onClose={() => setUpdatingFriendFailed(false)}
        />
      )}

      {deletingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Something went wrong while deleting your friend. Please try again later.'
          withBorder
          onClose={() => setDeletingFriendFailed(false)}
        />
      )}

      {importingFriendsFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Something went wrong while importing your friends. Please try again later.'
          withBorder
          onClose={() => setImportingFriendsFailed(false)}
        />
      )}

      {fetchingListFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title='Something went wrong while getting your list status. Please try again later.'
          withBorder
          onClose={() => setFetchingListFailed(false)}
        />
      )}
    </>
  );
}

export default Notifications;
