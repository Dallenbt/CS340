import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { MessageView, Presenter } from "./Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (isFollower: boolean) => void;
  setFollowerCount: (count: number) => void;
  setFolloweeCount: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setDisplayedUser: (user: User) => void;
  navigate: (path: string) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private readonly service = new FollowService();

  public constructor(view: UserInfoView) {
    super(view);
  }

  public async initialize(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [followerCount, followeeCount, isFollower] = await Promise.all([
        this.service.getFollowerCount(authToken, displayedUser),
        this.service.getFolloweeCount(authToken, displayedUser),
        currentUser.equals(displayedUser)
          ? Promise.resolve(false)
          : this.service.getIsFollowerStatus(
              authToken,
              currentUser,
              displayedUser,
            ),
      ]);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
      this.view.setIsFollower(isFollower);
    }, "load user information");
  }

  public switchToLoggedInUser(
    event: { preventDefault: () => void },
    currentUser: User,
    pathname: string,
  ): void {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser);
    const basePath = pathname.split("/@")[0] || "/";
    this.view.navigate(`${basePath}/${currentUser.alias}`);
  }

  public async follow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.changeFollowStatus(authToken, displayedUser, true);
  }

  public async unfollow(
    authToken: AuthToken,
    displayedUser: User,
  ): Promise<void> {
    await this.changeFollowStatus(authToken, displayedUser, false);
  }

  private async changeFollowStatus(
    authToken: AuthToken,
    displayedUser: User,
    follow: boolean,
  ): Promise<void> {
    const action = follow ? "Following" : "Unfollowing";
    let toastId = "";
    await this.doFailureReportingOperation(async () => {
      this.view.setLoading(true);
      toastId = this.view.displayInfoMessage(
        `${action} ${displayedUser.name}...`,
        0,
      );
      const [followerCount, followeeCount] = follow
        ? await this.service.follow(authToken, displayedUser)
        : await this.service.unfollow(authToken, displayedUser);
      this.view.setIsFollower(follow);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    }, "change follow status", () => {
      try {
        if (toastId) {
          this.view.deleteMessage(toastId);
        }
      } finally {
        this.view.setLoading(false);
      }
    });
  }
}
