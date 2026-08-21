import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import HomeScreen from '../app/home';

describe('HomeScreen', () => {
  test('renders home screen elements', () => {
    render(<HomeScreen />);
    
    // Verify that key elements are rendered
    expect(screen.getByText('Connected Devices')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  test('opens and closes camera view', async () => {
    render(<HomeScreen />);
    
    // Trigger the view feedback button click
    fireEvent.click(screen.getByText('View'));

    // Wait for the asynchronous process to complete
    await waitFor(() => {
      // Verify that the camera view is open
      expect(screen.getByText('Camera View')).toBeInTheDocument();
    });

    // Trigger the close camera button click
    fireEvent.click(screen.getByText('Esc'));

    // Wait for the asynchronous process to complete
    await waitFor(() => {
      // Verify that the camera view is closed
      expect(screen.queryByText('Camera View')).toBeNull();
    });
  });

});
