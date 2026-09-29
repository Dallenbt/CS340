import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastType } from "../toaster/Toast";
import { useMessageActions } from "../hooks/useMessageActions";

interface Props {
  heading: string;
}

const OAuth = ({ heading }: Props) => {
  const { displayToast } = useMessageActions();

  const showUnavailableMessage = (provider: string) => {
    displayToast(
      ToastType.Info,
      `${provider} registration is not implemented.`,
      3000,
      undefined,
      "text-white bg-primary"
    );
  };

  return (
    <>
      <h1 className="h4 mb-3 fw-normal">Or</h1>
      <h1 className="h5 mb-3 fw-normal">{heading}</h1>
      <div className="text-center mb-3">
        {[
          ["google", "Google"],
          ["facebook", "Facebook"],
          ["twitter", "Twitter"],
          ["linkedin", "LinkedIn"],
          ["github", "GitHub"],
        ].map(([provider, label]) => (
          <button
            key={provider}
            type="button"
            className="btn btn-link btn-floating mx-1"
            onClick={() => showUnavailableMessage(label)}
          >
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`${provider}Tooltip`}>{label}</Tooltip>}
            >
              <FontAwesomeIcon icon={["fab", provider] as ["fab", any]} />
            </OverlayTrigger>
          </button>
        ))}
      </div>
    </>
  );
};

export default OAuth;