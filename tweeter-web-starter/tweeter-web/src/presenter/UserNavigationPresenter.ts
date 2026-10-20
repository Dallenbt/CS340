import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private readonly service = new UserService();

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User | null,
    alias: string,
    featurePath: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const user = await this.service.getUser(authToken, alias);
      if (user && (!displayedUser || !user.equals(displayedUser))) {
        this.view.setDisplayedUser(user);
        this.view.navigate(`${featurePath}/${user.alias}`);
      }
    }, "get user");
  }
}
