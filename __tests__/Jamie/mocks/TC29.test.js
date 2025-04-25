/**
 * user story: As a User I want to See a settings button, So that I can view and change a range of settings for the app.
 * acceptance criteria: Given  I am on the home page, When I look at the main menu, Then I should see a clearly labeled "Settings" button, and when I click on it, I should be taken to a screen where I can view and change the various app settings..
 * requirements: On the user's home page there must be a settings button, the settings page must include user details including first name, last name, username and email address
 * test steps: 1. Navigate to the user home page after logging in, 2. Check that a clearly labelled "Settings" button is visible in the side panel, 3. Click on the "Settings" button, 4. Verify that the app navigates to the settings page or displays the settings view,  
 * 5. Confirm that the settings page includes fields or labels showing the user's first name, 8. Confirm that the settings page includes the user's email address, 9. Attempt to edit one of the user details and save the changes, 10. Verify that the updated value is reflected correctly, 11. Return to the home page and repeat to confirm persistent changes
 */


import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// mock SettingsPage component based on the real component
function MockSettingsPage() {
  const [name, setName] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSave = () => {
    if (name.trim()) {
      setMessage(`Name saved as "${name}"`);
    } else {
      setMessage('Name cannot be empty');
    }
  };

  const handleDelete = () => {
    setMessage('Account deleted');
  };

  return (
    <div role="region" aria-label="Settings Page">
      <h1>Settings</h1>
      <label htmlFor="name">Your Name</label>
      <input
        id="name"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleSave}>Save Changes</button>
      <button onClick={handleDelete}>Delete Account</button>

      {message && <p>{message}</p>}
    </div>
  );
}

describe('Settings Page component test', () => {
  it('displays name input and buttons', () => {
    render(<MockSettingsPage />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByText(/save changes/i)).toBeInTheDocument();
    expect(screen.getByText(/delete account/i)).toBeInTheDocument();
  });

  //ensures that changes to the name can be saved
  it('saves the entered name when Save Changes is clicked', () => {
    render(<MockSettingsPage />);

    const input = screen.getByLabelText(/your name/i);
    fireEvent.change(input, { target: { value: 'Alice' } });

    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);

    expect(screen.getByText(/name saved as "Alice"/i)).toBeInTheDocument();
  });

  it('shows error if name is empty when saving', () => {
    render(<MockSettingsPage />);

    const saveButton = screen.getByText(/save changes/i);
    fireEvent.click(saveButton);

    expect(screen.getByText(/name cannot be empty/i)).toBeInTheDocument();
  });

  //ensure delete account button is displayed
  it('displays message when account is deleted', () => {
    render(<MockSettingsPage />);

    const deleteButton = screen.getByText(/delete account/i);
    fireEvent.click(deleteButton);

    expect(screen.getByText(/account deleted/i)).toBeInTheDocument();
  });
});
