import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T> extends Presenter<
  PagedItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private userService = new UserService();

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

  public abstract loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void>;
}
