import { Status } from "tweeter-shared";
import { Link } from "react-router-dom";
import { useUserNavigation } from "../hooks/useUserNavigation";
import Post from "./Post";

interface Props {
  status: Status;
  featurePath: string;
}

const StatusItem = ({ status, featurePath }: Props) => {
  const navigateToUser = useUserNavigation(featurePath);

  return (
    <div className="row mb-3 mx-0 px-0 border rounded bg-white">
      <div className="col bg-light mx-0 px-0">
        <div className="container px-0">
          <div className="row mx-0 px-0">
            <div className="col-auto p-3">
              <img
                src={status.user.imageUrl}
                className="img-fluid"
                width="80"
                alt="Posting user"
              />
            </div>
            <div className="col">
              <h2>
                <b>
                  {status.user.firstName} {status.user.lastName}
                </b>{" "}
                -{" "}
                <Link
                  to={`${featurePath}/${status.user.alias}`}
                  onClick={(event) => navigateToUser(event, status.user.alias)}
                >
                  {status.user.alias}
                </Link>
              </h2>
              {status.formattedDate}
              <br />
              <Post status={status} featurePath={featurePath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusItem;