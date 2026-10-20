import { User } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";

export abstract class UserItemPresenter extends PagedItemPresenter<User> {}
