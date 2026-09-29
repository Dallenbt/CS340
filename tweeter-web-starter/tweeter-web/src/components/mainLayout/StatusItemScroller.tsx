import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";
import StatusItem from "../statusItem/StatusItem";

interface Props {
  items: Status[];
  hasMoreItems: boolean;
  loadMoreItems: () => void;
  featurePath: string;
}

const StatusItemScroller = ({
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
        <StatusItem key={index} status={item} featurePath={featurePath} />
      ))}
    </InfiniteScroll>
  </div>
);

export default StatusItemScroller;