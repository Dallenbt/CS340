import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";
import { FollowService } from "../model.service/FollowService";
import { StatusService } from "../model.service/StatusService";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<
  T,
  U extends FollowService | UserService | StatusService,
> extends Presenter<PagedItemView<T>> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: U;
  private userService = new UserService();

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.serviceFactory();
  }

  protected abstract serviceFactory(): U;

  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(item: T | null) {
    this._lastItem = item;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(hasMore: boolean) {
    this._hasMoreItems = hasMore;
  }

  protected get service() {
    return this._service

  }

  reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
    }, this.ItemDescription());
  }

  protected abstract ItemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[T[], boolean]>;
}
