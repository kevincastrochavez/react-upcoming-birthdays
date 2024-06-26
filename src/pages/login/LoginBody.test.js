import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for using Jest DOM matchers

import LoginBody from './LoginBody';

describe('LoginBody component', () => {
  it('renders heading', () => {
    const { getByText } = render(<LoginBody />);

    const headingText = getByText(/The WebApp that will make your friends/i);
    expect(headingText).toBeInTheDocument();
  });

  it('buttons are rendered with correct text and alt text', () => {
    const { getByText, getByAltText } = render(<LoginBody />);

    const googleAltText = getByAltText('Google SVG');
    const guestAltText = getByAltText('Guest SVG');

    const googleText = getByText(/Continue with Google/i);
    const guestText = getByText(/Continue as a Guest/i);

    expect(googleAltText).toBeInTheDocument();
    expect(guestAltText).toBeInTheDocument();

    expect(googleText).toBeInTheDocument();
    expect(guestText).toBeInTheDocument();
  });

  it('buttons have correct attributes', () => {
    const { getByTestId } = render(<LoginBody />);

    const googleId = getByTestId('google-button');
    const guestId = getByTestId('guest-button');

    expect(googleId).toHaveAttribute('is-google', 'true');
    expect(guestId).toHaveAttribute('is-guest', 'true');
  });
});
