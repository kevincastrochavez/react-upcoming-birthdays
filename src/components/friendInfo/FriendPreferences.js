/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { t } from 'i18next';

import colorIcon from '../../assets/color.svg';
import toothIcon from '../../assets/tooth.svg';
import celebrateIcon from '../../assets/celebrate.svg';

const friendInfoCss = css`
  margin-top: 24px;
  grid-column: 1/-1;
  grid-row: 4/5;
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
    color: #db8f8f;
    margin-left: 4px;
    font-size: 14px;
  }
`;

/**
 * Displays the FriendPreferences component which shows your friend's favorite color, if likes to celebrate and their tooth taste
 * @param {String} favoriteColor - favorite color
 * @param {Boolean} likesToCelebrate - true if friend likes to celebrate
 * @param {String} candyPreference - sweet or salty
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
          <span>{t('friendPreferences.tooth')}</span>
        </div>

        <p>{t(candyPreference)}</p>
      </div>
      <div>
        <div css={friendPreferenceCss}>
          <img src={celebrateIcon} alt='' />
          <span>{t('friendPreferences.celebrate')}</span>
        </div>

        <p>{t(likesToCelebrate)}</p>
      </div>
    </div>
  );
}

export default FriendPreferences;
