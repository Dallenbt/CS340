import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserHooks";
import {
  UserItemPresenter,
  UserItemView,
} from "../../presenter/UserItemPresenter";

interface Props {
  featurePath: string;
  presenterFactory: (listener: UserItemView) => UserItemPresenter;
}

const UserItemScroller = (props: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: UserItemView = {
    addItems: (newItems) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage,
  };

  const presenter = useRef<UserItemPresenter | null>(null);
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
      presenter.current!
        .getUser(authToken, displayedUserAliasParam)
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
            <UserItem user={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
