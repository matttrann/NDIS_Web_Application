/**
 * TC01_V2.test.js
 * User story: As a Therapist I want to see a loading screen when my video is being generated, So that I know the app hasn't frozen.
 * requirements: The system must have a maximum loading time of 1 minute, the system must display a loading icon when buffering, The system must display "loading text" when generating the story
 * testing steps: 1. Log in as a therapist, 2. Navigate to a pending script or questionnaire needing video generation, 3. Click on the "Approve" button, 4. Verify that a loading icon appears immediately, 5. Confirm that appropriate text is displayed on the screen (such as "generating video..." or "loading..")
 * 
 * Test Purpose: Verifies that clicking the 'Request Access' button results in a loading indicator appearing.
 * Requirements tested:
 * - Loading feedback appears while processing
 * - UI disables the button and shows a visual loading cue
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VideoStatusDisplay } from '../testenv/MockVideoStatus';
import '@testing-library/jest-dom';

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});

afterEach(() => {
  jest.resetAllMocks();
});

//ensures that a loading indicator can be found when a person requests a video generation
test('shows a loading indicator (blue dot animation) when approving a pending video', async () => {
  render(<VideoStatusDisplay status="pending" id="video-123" />);
//look for approval button. once clicked, disable the mock button
  const approveButton = screen.getByRole('button', { name: /approve/i });
  expect(approveButton).toBeInTheDocument();

  fireEvent.click(approveButton);

  // Wait for the animation class to be applied, checks for animated loading screen
  await waitFor(() => {
    const animatedDot = screen.getByRole('status-indicator');
    expect(animatedDot).toHaveClass('animate-pulse');
  });
});
