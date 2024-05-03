import React from 'react';
import { render } from '@testing-library/react';

import FriendPreferences from './FriendPreferences';

describe('FriendPreferences', () => {
  test('renders with correct props', () => {
    // Arrange
    const props = {
      favoriteColor: 'Blue',
      likesToCelebrate: true,
      candyPreference: 'Salty',
    };

    const { getByText, getByAltText } = render(
      <FriendPreferences {...props} />
    );

    const colorElement = getByText(/Color/);
    const toothElement = getByText(/Tooth/);
    const celebrateElement = getByText(/Celebrate/);

    // TODO: Figure out how to test SVG icons
    // const colorIcon = getByAltText('color icon');
    // const toothIcon = getByAltText('tooth icon');
    // const celebrateIcon = getByAltText('celebrate icon');

    expect(colorElement).toBeInTheDocument();
    expect(toothElement).toBeInTheDocument();
    expect(celebrateElement).toBeInTheDocument();

    // expect(colorIcon).toBeInTheDocument();
    // expect(toothIcon).toBeInTheDocument();
    // expect(celebrateIcon).toBeInTheDocument();

    const favoriteColor = getByText(/Blue/);
    const likesToCelebrate = getByText(/Yes/);
    const candyPreference = getByText(/Salty/);
    expect(favoriteColor).toBeInTheDocument();
    expect(likesToCelebrate).toBeInTheDocument();
    expect(candyPreference).toBeInTheDocument();
  });
});
