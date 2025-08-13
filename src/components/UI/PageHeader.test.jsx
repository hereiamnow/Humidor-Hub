import React from 'react';
import { render, screen } from '@testing-library/react';
import PageHeader from './PageHeader';

describe('PageHeader', () => {
  it('renders the title', () => {
    render(<PageHeader title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders the subtitle when provided', () => {
    render(<PageHeader title="My Title" subtitle="My Subtitle" />);
    expect(screen.getByText('My Subtitle')).toBeInTheDocument();
  });

  it('does not render the subtitle when not provided', () => {
    render(<PageHeader title="My Title" />);
    expect(screen.queryByText('My Subtitle')).not.toBeInTheDocument();
  });

  it('renders an icon when provided', () => {
    const Icon = () => <svg data-testid="test-icon" />;
    render(<PageHeader title="My Title" icon={Icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });
});
