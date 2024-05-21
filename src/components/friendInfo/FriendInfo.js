/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import { ThemeIcon, Tooltip } from '@mantine/core';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useClickOutside } from '@mantine/hooks';

import FriendPreferences from './FriendPreferences';
import { daysUntilBirthday, getNextBirthdayAge } from '../../helper/utils';
import { t } from 'i18next';
import { Trans } from 'react-i18next';

const spotlightHeadingCss = css`
  padding: 0 24px;
  margin-top: 60px;
  margin-bottom: 8px;
  text-align: right;

  @media (min-width: 600px) {
    padding: 0;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 1024px) {
    grid-column: 1/2;
    grid-row: 2/3;
    margin: 0;
    justify-self: end;
    margin-right: 48px;
  }
`;

const friendLinkCss = css`
  position: relative;
  max-width: 400px;
  margin: 0 auto;
  display: block;

  &:not([is-spotlight='true']) {
    cursor: unset;
  }

  @media (min-width: 1024px) {
    grid-column: 1/2;
    grid-row: 2/3;
    margin-top: 30px;
  }
`;

const visibleIconCss = css`
  position: absolute;
  top: 8px;
  right: 34px;
  z-index: 10;
  cursor: pointer;

  @media (min-width: 600px) {
    right: 12px;
  }
`;

const friendContainerCss = css`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 20px auto auto;
  column-gap: 20px;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;
  width: calc(100% - 48px);
  max-width: 400px;
  margin: 0 auto;

  @media (min-width: 600px) {
    width: 100%;
  }

  & > span {
    grid-column: 1/3;
    grid-row: 1/2;

    & img {
      width: 100%;
      border-radius: 50%;
      transform: translateY(calc(-50% - 20px));
      object-fit: cover;
    }
  }

  & > p {
    grid-column: 1/-1;
    color: #857e7e;
    font-size: 14px;
  }
`;

const friendNameCss = css`
  font-size: 16px;
  line-height: 20px;
  font-weight: 400;
  grid-column: 3/-1;
  grid-row: 1/2;
`;

const friendBirthdateCss = css`
  font-size: 24px;
  line-height: 1.5;
  font-weight: 400;
  grid-column: 1/-1;
  grid-row: 2/3;
  margin-top: 16px;

  & span {
    color: #8cc0de;
    font-size: 30px;
  }
`;

/**
 * Displays the FriendInfo component which shows your friend's name and birthday, along with a picture, favorite color, if likes to celebrate and their tooth taste
 * @param {Boolean} isSpotlight - true if friend is in spotlight on Dashboard
 * @param {String} formattedFullName - full name of the friend formatted
 * @param {String} imageUrl - image url for such friend
 * @param {String} favoriteColor - favorite color of the friend
 * @param {Boolean} likesToCelebrate - true if friend likes to celebrate
 * @param {String} candyPreference - sweet or salty
 * @param {String} birthdate - birthdate of the friend
 * @param {String} id - id of the friend
 * @returns {JSX} the FriendInfo component
 */
function FriendInfo({
  isSpotlight = false,
  firstName,
  formattedFullName,
  imageUrl,
  favoriteColor,
  likesToCelebrate,
  candyPreference,
  birthdate,
  id,
  isPrivate,
}) {
  const [openedTooltip, setOpenedTooltip] = useState(false);
  const ageTurningRef = useRef(0);
  const visibleBtnRef = useClickOutside(() => setOpenedTooltip(false));

  const { daysToBirthday, isBirthdayToday } = daysUntilBirthday(birthdate);

  useEffect(() => {
    ageTurningRef.current = getNextBirthdayAge(birthdate); // To avoid getting an undefined error
  }, [birthdate]);

  const visibleJsx = (
    <Tooltip
      label={t('friendInfo.tooltipVisible')}
      opened={openedTooltip}
      multiline
      w={220}
    >
      <ThemeIcon
        variant='light'
        aria-label='Settings'
        css={visibleIconCss}
        radius='xl'
        onClick={() => setOpenedTooltip((prev) => !prev)}
        ref={visibleBtnRef}
      >
        <IconEye style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ThemeIcon>
    </Tooltip>
  );

  const notVisibleJsx = (
    <Tooltip
      label={t('friendInfo.tooltipNotVisible')}
      opened={openedTooltip}
      multiline
      w={220}
    >
      <ThemeIcon
        variant='light'
        aria-label='Settings'
        css={visibleIconCss}
        radius='xl'
        onClick={() => setOpenedTooltip((prev) => !prev)}
        ref={visibleBtnRef}
      >
        <IconEyeOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
      </ThemeIcon>
    </Tooltip>
  );

  const visibleStatus = isPrivate ? notVisibleJsx : visibleJsx;

  return (
    <>
      {isSpotlight && (
        <p css={spotlightHeadingCss}>{t('friendInfo.closest')}</p>
      )}
      <Link
        to={`/allFriends/${id}`}
        key={id}
        css={friendLinkCss}
        data-tour={isSpotlight && 'spotlightFriend'}
        is-spotlight={isSpotlight && 'true'}
      >
        {!isSpotlight && visibleStatus}

        <div css={friendContainerCss}>
          <LazyLoadImage src={imageUrl} alt={''} width={'100%'} effect='blur' />
          <h2 css={friendNameCss}>{formattedFullName}</h2>
          {isBirthdayToday ? (
            <h1 css={friendBirthdateCss}>
              <Trans i18nKey='friendInfo.birthday'>
                {{ firstName }}'s birthday is
              </Trans>{' '}
              <span>{t('friendInfo.birthdate')}</span>
            </h1>
          ) : (
            <h1 css={friendBirthdateCss}>
              {t('friendInfo.comingUp')} <span>{daysToBirthday}</span>{' '}
              {t('friendInfo.days')}
            </h1>
          )}
          {!isSpotlight && (
            <p>
              {t('friendInfo.turning')} {ageTurningRef.current}
            </p>
          )}

          <FriendPreferences
            favoriteColor={favoriteColor}
            candyPreference={candyPreference}
            likesToCelebrate={likesToCelebrate}
          />
        </div>
      </Link>
    </>
  );
}

export { FriendInfo };
