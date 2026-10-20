import { Status } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export const STATUS_PAGE_SIZE = 10;

export abstract class StatusItemPresenter extends PagedItemPresenter<Status> {}
