import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import App from './App';

test('renders the main title', () => {
  render(
    <MantineProvider>
      <App />
    </MantineProvider>
  );
  const titleElement = screen.getByText(/Advanced Trading Predictor v1/i);
  expect(titleElement).toBeInTheDocument();
});
