import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

describe('Breadcrumbs', () => {
  test('renders correct breadcrumbs for the Dashboard page', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const dashboardText = getByText('Dashboard');
    const dashboardId = getByTestId('/');

    expect(dashboardText).toBeInTheDocument();
    expect(dashboardId.getAttribute('href')).toBe('/');
  });

  test('renders correct breadcrumbs for the All Friends page', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/allFriends']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const dashboardText = getByText('Dashboard');
    const dashboardId = getByTestId('/');

    const allFriendsText = getByText('All Friends');
    const allFriendsId = getByTestId('/allFriends');

    expect(dashboardText).toBeInTheDocument();
    expect(dashboardId.getAttribute('href')).toBe('/');
    expect(allFriendsText).toBeInTheDocument();
    expect(allFriendsId.getAttribute('href')).toBe('/allFriends');
  });

  test('renders correct breadcrumbs for the Share or Import page', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter initialEntries={['/shareImport']}>
        <Breadcrumbs />
      </MemoryRouter>
    );

    const dashboardText = getByText('Dashboard');
    const dashboardId = getByTestId('/');

    const shareImportText = getByText('Share or Import');
    const shareImportId = getByTestId('/shareImport');

    expect(dashboardText).toBeInTheDocument();
    expect(dashboardId.getAttribute('href')).toBe('/');
    expect(shareImportText).toBeInTheDocument();
    expect(shareImportId.getAttribute('href')).toBe('/shareImport');
  });
});
