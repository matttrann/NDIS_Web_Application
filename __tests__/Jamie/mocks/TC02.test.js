import { listS3Objects } from "@/lib/s3";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(),
    ListObjectsV2Command: jest.fn(),
  };
});

import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

describe("S3 Video Retrieval", () => {
  let s3Mock;

  beforeEach(() => {
    s3Mock = {
      send: jest.fn(),
    };
    S3Client.mockImplementation(() => s3Mock);
  });

  it("should fetch video list from S3", async () => {
    // Mock response from S3
    const mockResponse = {
      Contents: [
        { Key: "testVideo.mp4" },
      ],
    };

    s3Mock.send.mockResolvedValue(mockResponse);

    const videos = await listS3Objects();

    expect(s3Mock.send).toHaveBeenCalledTimes(1);
    expect(ListObjectsV2Command).toHaveBeenCalledWith({
      Bucket: "aws-skills4life-completedvideos",
    });
    expect(videos).toEqual(["testVideo.mp4"]);
  });

  it("should return an empty list when no videos are found", async () => {
    s3Mock.send.mockResolvedValue({ Contents: [] });

    const videos = await listS3Objects();

    expect(videos).toEqual([]);
  });

  it("should handle S3 errors gracefully", async () => {
    s3Mock.send.mockRejectedValue(new Error("S3 error"));

    const videos = await listS3Objects();

    expect(videos).toEqual([]); 
  });
});
