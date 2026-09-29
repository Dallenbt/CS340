import { useState, useEffect } from "react";
import { AuthToken, FakeData, User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import { ToastType } from "../toaster/Toast";
import UserItemScroller from "./UserItemScroller";
import { useMessageActions } from "../hooks/useMessageActions";
import { useUserInfo } from "../hooks/useUserInfo";
import { useUserInfoActions } from "../hooks/useUserInfoActions";

export const PAGE_SIZE = 10;

const FolloweesScroller = () => {
  const { displayToast } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<User | null>(null);

  const addItems = (newItems: User[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems(null);
  }, [displayedUser]);

  const reset = async () => {
    setItems(() => []);
    setLastItem(() => null);
    setHasMoreItems(() => true);
  };

  const loadMoreItems = async (lastItem: User | null) => {
    try {
      const [newItems, hasMore] = await loadMoreFollowees(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        lastItem
      );

      setHasMoreItems(() => hasMore);
      setLastItem(() => newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load followees because of exception: ${error}`,
        0
      );
    }
  };

  const loadMoreFollowees = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastFollowee: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastFollowee, pageSize, userAlias);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <UserItemScroller
      items={items}
      hasMoreItems={hasMoreItems}
      loadMoreItems={() => loadMoreItems(lastItem)}
      featurePath="/followees"
    />
  );
};

export default FolloweesScroller;
