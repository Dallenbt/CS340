import { AuthToken, FakeData, User } from "tweeter-shared";
import { Buffer } from "buffer";

export class AuthenticationService {
  public async login(
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> {
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid alias or password");
    }
    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ): Promise<[User, AuthToken]> {
    Buffer.from(imageBytes).toString("base64");
    const user = FakeData.instance.firstUser;
    if (user === null) {
      throw new Error("Invalid registration");
    }
    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  public async readImage(
    file: File,
  ): Promise<{ bytes: Uint8Array; dataUrl: string; extension: string }> {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    if (!extension) {
      throw new Error("Image file must have an extension");
    }
    return {
      bytes,
      dataUrl: `data:${file.type};base64,${Buffer.from(bytes).toString("base64")}`,
      extension,
    };
  }
}
