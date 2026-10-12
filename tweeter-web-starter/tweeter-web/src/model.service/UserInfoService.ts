import { AuthToken, User } from "tweeter-shared";
import { UserInfo } from "../components/userInfo/UserInfo";

const CURRENT_USER_KEY = "CurrentUserKey";
const AUTH_TOKEN_KEY = "AuthTokenKey";

export class UserInfoService {
  public retrieve(): UserInfo {
    const currentUser = User.fromJson(localStorage.getItem(CURRENT_USER_KEY));
    const authToken = AuthToken.fromJson(localStorage.getItem(AUTH_TOKEN_KEY));

    if (currentUser && authToken) {
      return {
        currentUser,
        displayedUser: currentUser,
        authToken,
      };
    }

    return { currentUser: null, displayedUser: null, authToken: null };
  }

  public save(currentUser: User, authToken: AuthToken): void {
    localStorage.setItem(CURRENT_USER_KEY, currentUser.toJson());
    localStorage.setItem(AUTH_TOKEN_KEY, authToken.toJson());
  }

  public clear(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
