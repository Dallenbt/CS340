import { AuthToken, User } from "tweeter-shared";
import { AuthenticationService } from "../model.service/AuthenticationService";

export interface RegisterView {
  setLoading: (loading: boolean) => void;
  setImage: (bytes: Uint8Array, dataUrl: string, extension: string) => void;
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

export class RegisterPresenter {
  private readonly view: RegisterView;
  private readonly service = new AuthenticationService();

  public constructor(view: RegisterView) {
    this.view = view;
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
      "text-white bg-primary",
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
        "text-white bg-danger",
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
    try {
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
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
        "text-white bg-danger",
      );
    } finally {
      this.view.setLoading(false);
    }
  }
}
