/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import cakeIcon from '../../assets/cake.svg';

/**
 * Displays the Moth Friend component, which displays their image, name and birthday
 * @param {} children - React children
 * @returns {JSX.Element}
 */
function MonthFriend({ imageUrl, fullName, birthdateFormatted }) {
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
  `;

  const friendImgCss = css`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 24px;
  `;

  const friendNameCss = css`
    flex: 1;
  `;

  const friendDateCss = css`
    display: flex;
    gap: 6px;
    align-items: center;

    & p {
      line-height: 16px;
      margin-bottom: -4px;
    }
  `;

  return (
    <div css={friendContainerCss}>
      <img src={imageUrl} alt='' css={friendImgCss} />
      <p css={friendNameCss}>{fullName}</p>

      <div css={friendDateCss}>
        <img src={cakeIcon} alt='' />
        <p>{birthdateFormatted}</p>
      </div>
    </div>
  );
}

export default MonthFriend;
