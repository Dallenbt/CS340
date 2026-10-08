import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  protected get itemDescription(): string {
    return "story items";
  }

  protected loadPage(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]> {
    return this.statusService.loadMoreStoryItems(
      authToken,
      userAlias,
      pageSize,
      lastItem,
    );
  }
}
