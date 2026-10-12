import { AuthToken, User, FakeData } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null,
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User,
  ): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User,
  ): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async follow(
    authToken: AuthToken,
    user: User,
  ): Promise<[number, number]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      await this.getFollowerCount(authToken, user),
      await this.getFolloweeCount(authToken, user),
    ];
  }

  public async unfollow(
    authToken: AuthToken,
    user: User,
  ): Promise<[number, number]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return [
      await this.getFollowerCount(authToken, user),
      await this.getFolloweeCount(authToken, user),
    ];
  }
}
