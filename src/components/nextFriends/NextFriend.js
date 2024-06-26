/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { t } from 'i18next';

import { daysUntilBirthday } from '../../helper/utils';

const nextFriendContainerCss = css`
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 13px 31px rgba(12, 20, 33, 0.04),
    0px 9.45547px 20.8947px rgba(12, 20, 33, 0.032375),
    0px 6.58125px 13.5141px rgba(12, 20, 33, 0.027),
    0px 4.31641px 8.38574px rgba(12, 20, 33, 0.023125),
    0px 2.6px 5.0375px rgba(12, 20, 33, 0.02),
    0px 1.37109px 2.99707px rgba(12, 20, 33, 0.016875),
    0px 0.56875px 1.79219px rgba(12, 20, 33, 0.013), inset 0px 2px 1px #ffffff;
  font-size: 12px;

  display: grid;
  grid-template-columns: 50px max-content;
  grid-template-rows: auto auto;
  column-gap: 12px;
  width: fit-content;

  @media (min-width: 1024px) {
    width: 200px;
    column-gap: 20px;
  }

  & > span {
    align-self: center;
    grid-column: 1/2;
    grid-row: 1/3;

    & img {
      width: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
`;

const nextFriendBottomCss = css`
  & span {
    color: #8cc0de;
    font-size: 18px;
  }
`;

/**
 * Displays the NextFriend component which shows your friend's name and birthday, along with a picture
 * @param {{String}} firstName - first name of the friend
 * @param {{String}} imageUrl - image url for such friend
 * @param {{String}} birthdate - birthdate of the friend
 * @returns {JSX} the NextFriend component
 */
function NextFriend({ friend: { firstName, imageUrl, birthdate } }) {
  const { daysToBirthday, isBirthdayToday } = daysUntilBirthday(birthdate);

  return (
    <div css={nextFriendContainerCss}>
      <LazyLoadImage src={imageUrl} alt={''} width={'100%'} effect='blur' />
      <p>
        {firstName}{' '}
        {isBirthdayToday ? t('nextFriends.is') : t('nextFriends.in')}
      </p>
      {isBirthdayToday ? (
        <p css={nextFriendBottomCss}>
          <span>{t('nextFriends.birthday')}</span>
        </p>
      ) : (
        <p css={nextFriendBottomCss}>
          <span>{daysToBirthday}</span> {t('nextFriends.days')}
        </p>
      )}
    </div>
  );
}

export default NextFriend;
