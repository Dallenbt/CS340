import { AuthToken, User } from "tweeter-shared";
import { FollowService } from "../model.service/FollowService";
import { UserItemPresenter } from "./UserItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";

export const PAGE_SIZE = 10;

export class FolloweePresenter extends UserItemPresenter {
  private service: FollowService;

  public constructor(view: PagedItemView<User>) {
    super(view);
    this.service = new FollowService();
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem,
      );

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, "load followees");
  }
}
