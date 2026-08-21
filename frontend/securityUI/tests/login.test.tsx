import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import LoginScreen from '../app/index';

describe('LoginScreen', () => {
  test('renders login form elements', () => {
    render(<LoginScreen />);
    
    // Verify that key elements are rendered
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Have an Account?')).toBeInTheDocument();
  });

  test('logs in with valid credentials', async () => {
    render(<LoginScreen />);
    
    // Fill in the form with valid credentials
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Trigger the login button click
    fireEvent.click(screen.getByText('Login'));

    // Wait for the asynchronous login process to complete
    await waitFor(() => {
      // Verify that the user is redirected to the home page after successful login
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  test('displays error message on invalid credentials', async () => {
    render(<LoginScreen />);
    
    // Fill in the form with invalid credentials
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid_email' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'invalid_password' } });

    // Trigger the login button click
    fireEvent.click(screen.getByText('Login'));

    // Wait for the asynchronous login process to complete
    await waitFor(() => {
      // Verify that an error message is displayed
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
  });

});
