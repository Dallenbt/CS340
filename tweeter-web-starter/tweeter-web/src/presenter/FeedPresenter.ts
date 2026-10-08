import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  protected get itemDescription(): string {
    return "feed items";
  }

  protected loadPage(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return this.statusService.loadMoreFeedItems(
      authToken,
      userAlias,
      pageSize,
      lastItem,
    );
  }
}
