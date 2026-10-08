import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private readonly view: UserNavigationView;
  private readonly service = new UserService();

  public constructor(view: UserNavigationView) {
    this.view = view;
  }

  public async navigateToUser(
    authToken: AuthToken,
    displayedUser: User | null,
    alias: string,
    featurePath: string,
  ): Promise<void> {
    try {
      const user = await this.service.getUser(authToken, alias);
      if (user && (!displayedUser || !user.equals(displayedUser))) {
        this.view.setDisplayedUser(user);
        this.view.navigate(`${featurePath}/${user.alias}`);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`,
      );
    }
  }
}
