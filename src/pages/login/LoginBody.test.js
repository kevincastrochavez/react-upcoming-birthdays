import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this for using Jest DOM matchers
import LoginBody from './LoginBody';

describe('LoginBody component', () => {
  it('renders heading', () => {
    const { getByText } = render(<LoginBody />);

    expect(
      getByText(/The WebApp that will make your friends/i)
    ).toBeInTheDocument();
  });

  it('buttons are rendered with correct text and alt text', () => {
    const { getByText, getByAltText } = render(<LoginBody />);

    // Check if buttons are rendered with correct text and alt text for images
    expect(getByAltText('Facebook SVG')).toBeInTheDocument();
    expect(getByText(/Continue with Facebook/i)).toBeInTheDocument();
    expect(getByAltText('Google SVG')).toBeInTheDocument();
    expect(getByText(/Continue with Google/i)).toBeInTheDocument();
    expect(getByAltText('Guest SVG')).toBeInTheDocument();
    expect(getByText(/Continue as a Guest/i)).toBeInTheDocument();
  });

  it('buttons have correct attributes', () => {
    const { getByTestId } = render(<LoginBody />);

    expect(getByTestId('facebook-button')).toHaveAttribute(
      'is-facebook',
      'true'
    );
    expect(getByTestId('google-button')).toHaveAttribute('is-google', 'true');
    expect(getByTestId('guest-button')).toHaveAttribute('is-guest', 'true');
  });
});
