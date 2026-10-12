import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface LoginView {
  setLoading: (loading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
  displayInfoMessage: (
    message: string,
    duration: number,
    bootstrapClasses?: string,
  ) => string;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class LoginPresenter {
  private readonly view: LoginView;
  private readonly service = new AuthenticationService();

  public constructor(view: LoginView) {
    this.view = view;
  }

  public canSubmit(alias: string, password: string): boolean {
    return !!alias && !!password;
  }

  public showOAuthUnavailable(provider: string): void {
    this.view.displayInfoMessage(
      `${provider} registration is not implemented.`,
      3000,
      "text-white bg-primary",
    );
  }

  public async login(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ): Promise<void> {
    try {
      this.view.setLoading(true);
      const [user, authToken] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(originalUrl || `/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`,
        "text-white bg-danger",
      );
    } finally {
      this.view.setLoading(false);
    }
  }
}
