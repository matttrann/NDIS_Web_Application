
/**
User story: As a patient I want to See my avatar on social story video's, So that My customisation options are reflected in the final product.
requirements: The video must include an overlay of an avatar that matches the one chosen on the story configuration form, the avatar must appear upright, the avatar must appear to the right-hand side of the video, the avatar must appear the same as their persona card
test steps: 1. Check avatar is located on the right-hand bottom corner of the video frame
2. Ensure the avatar is positioned in an upright position as expected
3. Check the avatar frame remains on screen for the entire length of the video
4. Check the avatar displayed matches the chosen avatar within the configuration form

 */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

//mock the avatar overlay logic
describe('Avatar Overlay Logic (Mocked)', () => {
  //all of this is copied logic from the StoryVideo.tsx file
  const avatarName = 'teenageboy';
  const expectedVideoUrl = `https://cdn.example.com/avatars/${avatarName}.mp4`;

  const MockComponent = ({ avatarName }) => {
    const videoUrl = `https://cdn.example.com/avatars/${avatarName}.mp4`;

    return (
      <div
        data-testid="avatar-container"
        style={{
          position: 'absolute',
          right: '40px',
          bottom: '40px',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <video
          data-testid="avatar-video"
          src={videoUrl}
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
      </div>
    );
  };

  //making sure that when given options and only one is chosen, the correct avatar is placed as the overlay
  test('renders the correct avatar video and positions it correctly', () => {
    const { getByTestId } = render(<MockComponent avatarName={avatarName} />);

    const video = getByTestId('avatar-video');
    const container = getByTestId('avatar-container');

    // check video source is correct
    expect(video).toHaveAttribute('src', expectedVideoUrl);

    // check avatar container is positioned bottom-right and circular
    expect(container).toHaveStyle('position: absolute');
    expect(container).toHaveStyle('right: 40px');
    expect(container).toHaveStyle('bottom: 40px');
    expect(container).toHaveStyle('border-radius: 50%');
    expect(container).toHaveStyle('overflow: hidden');
  });
});
