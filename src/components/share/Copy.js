import React from 'react';
import { CopyButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

function Copy({ listUrlToShare, disabled }) {
  return (
    <CopyButton value={listUrlToShare} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position='right'>
          <ActionIcon
            color={copied ? 'teal' : 'gray'}
            variant='subtle'
            onClick={copy}
            disabled={disabled}
          >
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}

export default Copy;
