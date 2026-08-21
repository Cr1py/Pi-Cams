import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import SignupScreen from '../app/signup';

describe('SignupScreen', () => {
  test('renders signup form elements', () => {
    render(<SignupScreen />);
    
    // Verify that key elements are rendered
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Have an Account?')).toBeInTheDocument();
  });

  test('submits signup form with valid data', async () => {
    render(<SignupScreen />);
    
    // Fill in the form with valid data
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile'), { target: { value: '1234567890' } });

    // Trigger the signup button click
    fireEvent.click(screen.getByText('Signup'));

    // Wait for the asynchronous signup process to complete
    await waitFor(() => {
      // Verify that the user is redirected to the home page after successful signup
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  test('displays error message on invalid signup data', async () => {
    render(<SignupScreen />);
    
    // Fill in the form with invalid data (e.g., missing required fields)
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid_email' } });
    fireEvent.change(screen.getByPlaceholderText('Mobile'), { target: { value: '1234567890' } });

    // Trigger the signup button click
    fireEvent.click(screen.getByText('Signup'));

    // Wait for the asynchronous signup process to complete
    await waitFor(() => {
      // Verify that an error message is displayed
      expect(screen.getByText('Could not sign up. Please try again.')).toBeInTheDocument();
    });
  });
});
