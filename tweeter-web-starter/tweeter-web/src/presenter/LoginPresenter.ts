import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { MessageView, Presenter } from "./Presenter";

export interface LoginView extends MessageView {
  setLoading: (loading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
}

export class LoginPresenter extends Presenter<LoginView> {
  private readonly service = new AuthenticationService();

  public constructor(view: LoginView) {
    super(view);
  }

  public canSubmit(alias: string, password: string): boolean {
    return !!alias && !!password;
  }

  public showOAuthUnavailable(provider: string): void {
    this.view.displayInfoMessage(
      `${provider} registration is not implemented.`,
      3000,
    );
  }

  public async login(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string,
  ): Promise<void> {
    this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);
      const [user, authToken] = await this.service.login(alias, password);
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(originalUrl || `/feed/${user.alias}`);
    }, "log user in");
    this.view.setLoading(false);
  }
}
