import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

interface Props {
  onProviderSelected: (provider: string) => void;
}

const OAuth = ({ onProviderSelected }: Props) => {
  const providers = [
    ["Google", "google"],
    ["Facebook", "facebook"],
    ["Twitter", "twitter"],
    ["LinkedIn", "linkedin"],
    ["GitHub", "github"],
  ] as const;

  return (
    <div className="text-center mb-3">
      {providers.map(([name, icon]) => (
        <button
          key={name}
          type="button"
          className="btn btn-link btn-floating mx-1"
          onClick={() => onProviderSelected(name)}
        >
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`${icon}Tooltip`}>{name}</Tooltip>}
          >
            <FontAwesomeIcon icon={["fab", icon]} />
          </OverlayTrigger>
        </button>
      ))}
    </div>
  );
};

export default OAuth;
