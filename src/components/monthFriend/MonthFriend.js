/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import cakeIcon from '../../assets/cake.svg';

const friendContainerCss = css`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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

  & img {
    border-radius: 50%;
    object-fit: cover;
  }
`;

const friendNameCss = css`
  flex: 1;
  font-size: 14px;
  margin-left: 24px;
`;

const friendDateCss = css`
  display: flex;
  gap: 6px;
  align-items: center;

  & p {
    line-height: 16px;
    margin-bottom: -4px;
    font-size: 14px;
  }
`;

/**
 * Displays the Month Friend component, which displays their image, name and birthday
 * @param {String} imageUrl - image url for such friend
 * @param {String} formattedFullName - full name of the friend
 * @param {String} shortenedBirthdateFormatted - shortened formatted birth date
 * @returns {JSX.Element}
 */
function MonthFriend({
  imageUrl,
  formattedFullName,
  shortenedBirthdateFormatted,
}) {
  return (
    <div css={friendContainerCss}>
      <LazyLoadImage
        src={imageUrl}
        alt={''}
        width={50}
        height={50}
        effect='blur'
      />
      <p css={friendNameCss}>{formattedFullName}</p>

      <div css={friendDateCss}>
        <img src={cakeIcon} alt='' />
        <p>{shortenedBirthdateFormatted}</p>
      </div>
    </div>
  );
}

export default MonthFriend;
