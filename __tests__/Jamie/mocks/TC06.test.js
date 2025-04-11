/**
 * user story: As a therapist I want to Be able to review my social story before sending it to the patient, So that I can screen it for harmful output.
 * requirements: A therapist must have the ability to approve a story before it's sent to the patient, the system must include a story review page, The story review page must include an approve button, the generated text, patient assignment and video
 * test steps: 1. Navigate to the approval page
2. Locate the relevant questionnaire and associated script
3. Capture the generated text
4. Change one word in the script
5. Save
6. Click the approve button beside the script
7. Generate video based on the changed and approved script
8. Locate generated video
9. Follow steps in TC05
 * 
 * 
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

global.fetch = jest.fn();


//mock script review page
describe('Mocked Script Review Workflow', () => {
  const originalScript = 'Jamie was feeling anxious today and wanted help understanding what to do when things get loud.';

  const MockScriptReview = () => {
    const [script, setScript] = useState(originalScript);

    const handleApprove = async () => {
      await fetch('/api/video-request/vid-123/script', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, action: 'approve' }),
      });
    };

    return (
      <div>
        <textarea
          data-testid="script-input"
          value={script}
          onChange={(e) => setScript(e.target.value)}
        />
        <button
          onClick={handleApprove}
          disabled={script.split(' ').length < 3}
        >
          Approve & Generate Video
        </button>
      </div>
    );
  };

  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  //testing in a mock env that a therapise can approve scripts
  test('therapist can edit and approve a script', async () => {
    render(<MockScriptReview />);

    // Step 1: Script is pre-filled
    const input = screen.getByTestId('script-input');
    expect(input.value).toContain('Jamie was feeling anxious');

    // Step 2: Edit one word
    fireEvent.change(input, {
      target: { value: originalScript.replace('loud', 'noisy') },
    });

    // Step 3: Approve
    const button = screen.getByRole('button', { name: /approve & generate video/i });
    fireEvent.click(button);

    // Step 4: Assert correct PATCH call using logic from actual application 
    await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
            '/api/video-request/vid-123/script',
            expect.objectContaining({
              method: 'PATCH',
              headers: expect.objectContaining({
                'Content-Type': 'application/json',
              }),
              body: expect.stringContaining('noisy'), // Just match key info
            })
          );
    });
  });
});
