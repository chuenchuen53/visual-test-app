import fs from "fs-extra";
import { userSettingFilepath } from "../Filepath";
import { UserSettingHelper } from "../data-files/UserSettingHelper";
import { Log } from "../decorator/Log";
import { CatchError } from "../decorator/CatchError";
import { LogError } from "../decorator/LogError";
import type { UserSettingService } from "./UserSettingService";
import type { UserSetting } from "../../shared/type";

export class UserSettingServiceImpl implements UserSettingService {
  private static readonly instance: UserSettingService = new UserSettingServiceImpl();

  public static getInstance(): UserSettingService {
    return UserSettingServiceImpl.instance;
  }

  private constructor() {}

  @CatchError<string[]>([])
  @LogError()
  public async getProjectsInTab(): Promise<string[]> {
    const setting = await UserSettingHelper.read();
    return setting?.projectsInTab ?? [];
  }

  @CatchError<boolean>(false)
  @Log()
  public async updateProjectsInTab(projects: string[]): Promise<boolean> {
    const setting: UserSetting = (await UserSettingHelper.read()) ?? {};
    setting.projectsInTab = projects;
    await fs.writeJson(userSettingFilepath, setting);
    return true;
  }
}
