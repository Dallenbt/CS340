import { AuthToken } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { MessageView, Presenter } from "./Presenter";
import { UserService } from "../model.service/UserService";

export interface AppNavbarView extends MessageView {
  clearUserInfo: () => void;
  navigate: (path: string) => void;
}

export class AppNavbarPresenter extends Presenter<AppNavbarView> {
  private _service = new AuthenticationService();

  public constructor(view: AppNavbarView) {
    super(view);
    this._service = new AuthenticationService();
  }

  public get service() {
    return this._service;
  }

  public async logout(authToken: AuthToken): Promise<void> {
    
    await this.doFailureReportingOperation(
      async () => {
        const toastId = this.view.displayInfoMessage("Logging Out...", 0);
        await this.service.logout(authToken);
        this.view.deleteMessage(toastId)
        this.view.clearUserInfo();
        this.view.navigate("/login");
      },
      "log user out",
    );
  }
}
