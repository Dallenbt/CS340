import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import UserItem from "../userItem/UserItem";

interface Props {
  items: User[];
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  featurePath: string;
}

const UserItemScroller = ({
  items,
  hasMoreItems,
  loadMoreItems,
  featurePath,
}: Props) => (
  <div className="container px-0 overflow-visible vh-100">
    <InfiniteScroll
      className="pr-0 mr-0"
      dataLength={items.length}
      next={loadMoreItems}
      hasMore={hasMoreItems}
      loader={<h4>Loading...</h4>}
    >
      {items.map((item, index) => (
        <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
          <UserItem user={item} featurePath={featurePath} />
        </div>
      ))}
    </InfiniteScroll>
  </div>
);

export default UserItemScroller;