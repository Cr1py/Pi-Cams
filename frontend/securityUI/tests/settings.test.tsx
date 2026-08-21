import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SettingsScreen from '../app/settings';

describe('SettingsScreen', () => {
  test('renders settings screen elements', () => {
    render(<SettingsScreen />);
    
    // Verify that key elements are rendered
    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByText('Update Account')).toBeInTheDocument();
    expect(screen.getByText('Personalization')).toBeInTheDocument();
    expect(screen.getByText('Enable Notifications')).toBeInTheDocument();
  });

  test('toggles notifications switch', () => {
    render(<SettingsScreen />);
    
    // Verify that the notifications switch is initially enabled
    expect(screen.getByTestId('notifications-switch')).toBeChecked();

    // Toggle the notifications switch
    fireEvent.click(screen.getByTestId('notifications-switch'));

    // Verify that the notifications switch is now disabled
    expect(screen.getByTestId('notifications-switch')).not.toBeChecked();
  });

  test('updates account details on button click', async () => {
    render(<SettingsScreen />);
    
    // Fill in the account details form
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'new_password' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile'), { target: { value: '1234567890' } });

    // Trigger the update account button click
    fireEvent.click(screen.getByText('Update Account'));

    // Wait for the asynchronous update process to complete
    await waitFor(() => {
      // Verify that a success message is displayed
      expect(screen.getByText('Account details updated successfully')).toBeInTheDocument();
    });
  });

});
