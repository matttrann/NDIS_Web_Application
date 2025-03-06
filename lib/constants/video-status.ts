export const VIDEO_STATUS = {
  pending: {
    label: "Pending Approval",
    description: "Waiting for admin approval",
    progress: 0
  },
  processing: {
    label: "Processing",
    description: "Starting video generation",
    progress: 10
  },
  script_pending_review: {
    label: "Script Review",
    description: "Waiting for script approval",
    progress: 20
  },
  script_approved: {
    label: "Script Approved",
    description: "Starting audio generation",
    progress: 30
  },
  audio_generated: {
    label: "Audio Generated",
    description: "Creating voice narration",
    progress: 40
  },
  captions_generated: {
    label: "Captions Added",
    description: "Generating video frames",
    progress: 60
  },
  frames_generated: {
    label: "Frames Generated",
    description: "Creating lip sync animation",
    progress: 80
  },
  frames_partially_generated: {
    label: "Frames Partially Generated",
    description: "Some frames failed to generate",
    progress: 70
  },
  completed: {
    label: "Completed",
    description: "Video generation finished",
    progress: 100
  },
  failed: {
    label: "Failed",
    description: "Video generation failed",
    progress: 0
  },
  script_rejected: {
    label: "Script Rejected",
    description: "Script was rejected by admin",
    progress: 0
  }
} as const;

export type VideoStatus = keyof typeof VIDEO_STATUS; 