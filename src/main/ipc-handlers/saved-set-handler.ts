import { ipcMain } from "electron";
import { SavedSetChannelKey } from "../../shared/SavedSetApi";
import { FilepathHelper } from "../Filepath";
import { openInExplorer } from "../utils";
import type { SavedSetApi } from "../../shared/SavedSetApi";
import type { IpcMainHandler } from "../../shared/ipc-type-helper";
import type { SavedSetService } from "../service/SavedSetService";

export function registerSavedSetHandlers(service: SavedSetService) {
  const handler: IpcMainHandler<SavedSetApi> = {
    send: {
      openScreenshotSetInExplorer: (_, req) => {
        const { project, branch, setId } = req;
        const dir = FilepathHelper.savedScreenshotSetDir(project, branch, setId);
        openInExplorer(dir);
      },
      openComparisonSetInExplorer: (_, req) => {
        const { project, setId } = req;
        const dir = FilepathHelper.savedComparisonSetDir(project, setId);
        openInExplorer(dir);
      },
    },
    invoke: {
      getAllSavedProjects: async () => service.getAllSavedProjects(),
      getAllSavedScreenshotSets: async (_, project) => await service.getAllSavedScreenshotSets(project),
      getAllSavedSets: async (_, project) => await service.getAllSavedSets(project),
      getSavedScreenshotMetadata: async (_, req) =>
        service.getSavedScreenshotMetadata(req.project, req.branch, req.setId),
      getSavedComparisonMetadata: async (_, req) => service.getSavedComparisonMetadata(req.project, req.setId),
      deleteScreenshotSet: (_, req) => service.deleteScreenshotSet(req.project, req.branch, req.setId),
      deleteComparisonSet: (_, req) => service.deleteComparisonSet(req.project, req.setId),
      deleteScreenshotBranch: (_, req) => service.deleteScreenshotBranch(req.project, req.branch),
      deleteProject: (_, req) => service.deleteProject(req.project),
    },
  };

  ipcMain.on(SavedSetChannelKey.send.openScreenshotSetInExplorer, handler.send.openScreenshotSetInExplorer);
  ipcMain.on(SavedSetChannelKey.send.openComparisonSetInExplorer, handler.send.openComparisonSetInExplorer);

  ipcMain.handle(SavedSetChannelKey.invoke.getAllSavedProjects, handler.invoke.getAllSavedProjects);
  ipcMain.handle(SavedSetChannelKey.invoke.getAllSavedScreenshotSets, handler.invoke.getAllSavedScreenshotSets);
  ipcMain.handle(SavedSetChannelKey.invoke.getAllSavedSets, handler.invoke.getAllSavedSets);
  ipcMain.handle(SavedSetChannelKey.invoke.getSavedScreenshotMetadata, handler.invoke.getSavedScreenshotMetadata);
  ipcMain.handle(SavedSetChannelKey.invoke.getSavedComparisonMetadata, handler.invoke.getSavedComparisonMetadata);
  ipcMain.handle(SavedSetChannelKey.invoke.deleteScreenshotSet, handler.invoke.deleteScreenshotSet);
  ipcMain.handle(SavedSetChannelKey.invoke.deleteComparisonSet, handler.invoke.deleteComparisonSet);
  ipcMain.handle(SavedSetChannelKey.invoke.deleteScreenshotBranch, handler.invoke.deleteScreenshotBranch);
  ipcMain.handle(SavedSetChannelKey.invoke.deleteProject, handler.invoke.deleteProject);
}
