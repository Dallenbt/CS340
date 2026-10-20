import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ReactNode } from "react";
import { AuthToken, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import { PagedItemView } from "../../presenter/PagedItemPresenter";

interface ItemScrollerPresenter<T> {
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
  reset: () => void;
  loadMoreItems: (authToken: AuthToken, userAlias: string) => Promise<void>;
  readonly hasMoreItems: boolean;
}

interface Props<T> {
  featurePath: string;
  presenterFactory: (
    listener: PagedItemView<T>,
  ) => ItemScrollerPresenter<T>;
  renderItem: (item: T, featurePath: string) => ReactNode;
}

const ItemScroller = <T,>(props: Props<T>) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: PagedItemView<T> = {
    addItems: (newItems) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage,
  };

  const presenter = useRef<ItemScrollerPresenter<T> | null>(null);
  if (!presenter.current) {
    presenter.current = props.presenterFactory(listener);
  }

  useEffect(() => {
    if (
      authToken &&
      displayedUser &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser.alias
    ) {
      presenter
        .current!.getUser(authToken, displayedUserAliasParam)
        .then((user) => {
          if (user) {
            setDisplayedUser(user);
          }
        })
        .catch((error) =>
          displayErrorMessage(
            `Failed to get user because of exception: ${error}`,
            "text-white bg-danger",
          ),
        );
    }
  }, [
    authToken,
    displayedUser,
    displayedUserAliasParam,
    displayErrorMessage,
    setDisplayedUser,
  ]);

  useEffect(() => {
    if (authToken && displayedUser) {
      setItems([]);
      presenter.current!.reset();
      void presenter.current!.loadMoreItems(authToken, displayedUser.alias);
    }
  }, [authToken, displayedUser]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => {
          if (authToken && displayedUser) {
            void presenter.current!.loadMoreItems(
              authToken,
              displayedUser.alias,
            );
          }
        }}
        hasMore={presenter.current!.hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            {props.renderItem(item, props.featurePath)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
