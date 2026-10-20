import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model.service/StatusService";
import { UserService } from "../model.service/UserService";
import { Presenter, View } from "./Presenter";

export const STATUS_PAGE_SIZE = 10;

export interface StatusItemView extends View {
  addItems: (items: Status[]) => void;
}

export abstract class StatusItemPresenter extends Presenter<StatusItemView> {
  private readonly service: StatusService;
  private readonly userService = new UserService();
  private _lastItem: Status | null = null;
  private _hasMoreItems = true;

  protected constructor(view: StatusItemView) {
    super(view);
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
    this.doFailureReportingOperation(async () => {
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
    }, `load ${this.itemDescription}`);
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
