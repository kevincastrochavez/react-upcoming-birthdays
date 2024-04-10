/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import FriendPreferences from './FriendPreferences';
import { daysUntilBirthday } from '../../helper/utils';

const spotlightHeadingCss = css`
  margin-top: 60px;
  margin-bottom: 8px;
  text-align: right;
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
  max-width: 400px;
  margin: 0 auto;

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
  margin-bottom: 24px;

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
 * @param {String} candyPreference - sweet or sour
 * @param {String} birthdate - birthdate of the friend
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
}) {
  const { daysToBirthday, isBirthdayToday } = daysUntilBirthday(birthdate);

  return (
    <>
      {isSpotlight && <p css={spotlightHeadingCss}>Closest Birthday </p>}
      <div css={friendContainerCss}>
        <LazyLoadImage src={imageUrl} alt={''} width={'100%'} effect='blur' />
        {/* <img src={imageUrl} alt=''  /> */}
        <h2 css={friendNameCss}>{formattedFullName}</h2>
        {isBirthdayToday ? (
          <h1 css={friendBirthdateCss}>
            {firstName}'s birthday is <span>Today!</span>
          </h1>
        ) : (
          <h1 css={friendBirthdateCss}>
            Coming up in <span>{daysToBirthday}</span> days
          </h1>
        )}

        <FriendPreferences
          favoriteColor={favoriteColor}
          candyPreference={candyPreference}
          likesToCelebrate={likesToCelebrate}
        />
      </div>
    </>
  );
}

export { FriendInfo };
