import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";

export const STATUS_PAGE_SIZE = 10;

export interface StatusItemView {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export abstract class StatusItemPresenter {
  private readonly view: StatusItemView;
  private readonly service: StatusService;
  private readonly userService = new UserService();
  private _lastItem: Status | null = null;
  private _hasMoreItems = true;

  protected constructor(view: StatusItemView) {
    this.view = view;
    this.service = new StatusService();
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  public reset(): void {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  public getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    return this.userService.getUser(authToken, alias);
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    try {
      const [items, hasMore] = await this.loadPage(
        authToken,
        userAlias,
        STATUS_PAGE_SIZE,
        this._lastItem,
      );
      this._hasMoreItems = hasMore;
      if (items.length > 0) {
        this._lastItem = items[items.length - 1];
      }
      this.view.addItems(items);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to load ${this.itemDescription} because of exception: ${error}`,
        "text-white bg-danger",
      );
    }
  }

  protected abstract get itemDescription(): string;

  protected abstract loadPage(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null,
  ): Promise<[Status[], boolean]>;

  protected get statusService(): StatusService {
    return this.service;
  }
}
