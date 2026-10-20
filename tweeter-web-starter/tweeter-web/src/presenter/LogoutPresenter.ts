import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { MessageView, Presenter } from "./Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private readonly service = new AuthenticationService();

  public constructor(view: LogoutView) {
    super(view);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const toastId = this.view.displayInfoMessage("Logging Out...", 0);
    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken);
      this.view.clearUserInfo();
      this.view.navigate("/login");
    }, "log user out");
    this.view.deleteMessage(toastId);
  }
}
