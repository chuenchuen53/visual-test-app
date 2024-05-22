import type { StoryMetadata, StoryState, Viewport } from "../../shared/type";
import type { GetStoriesMetadataResult, ScreenshotStoriesResult } from "./type";

export interface Crawler {
  getStoriesMetadata(
    storybookUrl: string,
    onStartingBrowser: () => void,
    onComputingMetadata: () => void,
    onError: (err: Error) => void,
  ): Promise<GetStoriesMetadataResult>;

  screenshotStories(
    storybookUrl: string,
    storyMetadataList: StoryMetadata[],
    viewport: Viewport,
    parallel: number,
    onStartScreenshot: () => void,
    onStoryStateChange: (storyId: string, state: StoryState, browserName: string, storyErr: boolean | null) => void,
  ): Promise<ScreenshotStoriesResult>;
}