/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import colorIcon from '../../assets/color.svg';
import toothIcon from '../../assets/tooth.svg';
import celebrateIcon from '../../assets/celebrate.svg';

const friendInfoCss = css`
  grid-column: 1/-1;
  grid-row: 3/4;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  & p {
    text-transform: capitalize;
  }
`;

const friendPreferenceCss = css`
  display: flex;

  & span {
    color: #f4bfbf;
    margin-left: 4px;
    font-size: 14px;
  }
`;

/**
 * Displays the FriendPreferences component which shows your friend's favorite color, if likes to celebrate and their tooth taste
 * @param {String} favoriteColor - favorite color
 * @param {Boolean} likesToCelebrate - true if friend likes to celebrate
 * @param {String} candyPreference - sweet or sour
 * @returns {JSX} the FriendPreferences component
 */
function FriendPreferences({
  favoriteColor,
  likesToCelebrate,
  candyPreference,
}) {
  return (
    <div css={friendInfoCss}>
      <div>
        <div css={friendPreferenceCss}>
          <img src={colorIcon} alt='' />
          <span>Color</span>
        </div>

        <p>{favoriteColor}</p>
      </div>
      <div>
        <div css={friendPreferenceCss}>
          <img src={toothIcon} alt='' />
          <span>Tooth</span>
        </div>

        <p>{candyPreference}</p>
      </div>
      <div>
        <div css={friendPreferenceCss}>
          <img src={celebrateIcon} alt='' />
          <span>Celebrate</span>
        </div>

        <p>{likesToCelebrate}</p>
      </div>
    </div>
  );
}

export default FriendPreferences;
