import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface LogoutView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
  displayErrorMessage: (message: string) => void;
}

export class LogoutPresenter {
  private readonly view: LogoutView;
  private readonly service = new AuthenticationService();

  public constructor(view: LogoutView) {
    this.view = view;
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const toastId = this.view.displayInfoMessage("Logging Out...", 0);
    try {
      await this.service.logout(authToken);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(toastId);
    }
  }
}
