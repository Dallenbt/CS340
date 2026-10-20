import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";
import { MessageView, Presenter } from "./Presenter";

export interface RegisterView extends MessageView {
  setLoading: (loading: boolean) => void;
  setImage: (bytes: Uint8Array, dataUrl: string, extension: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean,
  ) => void;
  navigate: (path: string) => void;
}

export class RegisterPresenter extends Presenter<RegisterView> {
  private readonly service = new AuthenticationService();

  public constructor(view: RegisterView) {
    super(view);
  }

  public canSubmit(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string,
  ): boolean {
    return !!(
      firstName &&
      lastName &&
      alias &&
      password &&
      imageUrl &&
      imageFileExtension
    );
  }

  public showOAuthUnavailable(provider: string): void {
    this.view.displayInfoMessage(
      `${provider} registration is not implemented.`,
      3000,
    );
  }

  public async selectImage(file: File | undefined): Promise<void> {
    if (!file) {
      this.view.setImage(new Uint8Array(), "", "");
      return;
    }
    try {
      const image = await this.service.readImage(file);
      this.view.setImage(image.bytes, image.dataUrl, image.extension);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to read user image because of exception: ${error}`,
      );
    }
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);
      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
      );
      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    }, "register user", () => this.view.setLoading(false));
  }
}
