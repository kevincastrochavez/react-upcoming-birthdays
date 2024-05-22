/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { t } from 'i18next';

import { useActionFriends, useSetAddingFriends } from '../BirthdayProvider';

const addedNotificationCss = css`
  position: fixed;
  top: 90px;
  left: 24px;
  right: 24px;
  z-index: 10;
  max-width: 400px;

  @media (min-width: 600px) {
    left: unset;
    right: 30px;
  }

  @media (min-width: 1024px) {
    right: calc((100% - 1024px) / 2);
  }
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
          title={t('notifications.addedSuccess')}
          withBorder
          onClose={() => setFriendWasAdded(false)}
        />
      )}

      {friendWasUpdated && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title={t('notifications.updatedSuccess')}
          withBorder
          onClose={() => setFriendWasUpdated(false)}
        />
      )}

      {friendWasDeleted && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title={t('notifications.deletedSuccess')}
          withBorder
          onClose={() => setFriendWasDeleted(false)}
        />
      )}

      {friendsWereImported && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title={t('notifications.importedSuccess')}
          withBorder
          onClose={() => setFriendsWereImported(false)}
        />
      )}

      {listWasUpdated && (
        <Notification
          css={addedNotificationCss}
          icon={checkIcon}
          color='teal'
          title={t('notifications.listSuccess')}
          withBorder
          onClose={() => setListWasUpdated(false)}
        />
      )}

      {addingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title={t('notifications.addedFailed')}
          withBorder
          onClose={() => setAddingFriendFailed(false)}
        />
      )}

      {updatingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title={t('notifications.updatedFailed')}
          withBorder
          onClose={() => setUpdatingFriendFailed(false)}
        />
      )}

      {deletingFriendFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title={t('notifications.deletedFailed')}
          withBorder
          onClose={() => setDeletingFriendFailed(false)}
        />
      )}

      {importingFriendsFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title={t('notifications.importedFailed')}
          withBorder
          onClose={() => setImportingFriendsFailed(false)}
        />
      )}

      {fetchingListFailed && (
        <Notification
          css={addedNotificationCss}
          icon={closeIcon}
          color='red'
          title={t('notifications.listFailed')}
          withBorder
          onClose={() => setFetchingListFailed(false)}
        />
      )}
    </>
  );
}

export default Notifications;
