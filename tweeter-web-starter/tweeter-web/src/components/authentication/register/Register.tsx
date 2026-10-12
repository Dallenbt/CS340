import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { ChangeEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { RegisterPresenter } from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileExtension, setImageFileExtension] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage, displayInfoMessage } = useMessageActions();

  const presenter = useRef<RegisterPresenter | null>(null);
  if (!presenter.current) {
    presenter.current = new RegisterPresenter({
      setLoading: setIsLoading,
      setImage: (bytes, dataUrl, extension) => {
        setImageBytes(bytes);
        setImageUrl(dataUrl);
        setImageFileExtension(extension);
      },
      updateUserInfo,
      navigate,
      displayInfoMessage,
      displayErrorMessage,
    });
  }

  const canSubmit = presenter.current.canSubmit(
    firstName,
    lastName,
    alias,
    password,
    imageUrl,
    imageFileExtension,
  );
  const submit = () =>
    void presenter.current!.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe,
    );
  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && canSubmit) {
      submit();
    }
  };
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    void presenter.current!.selectImage(event.target.files?.[0]);
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFields={
        <>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              size={50}
              id="firstNameInput"
              placeholder="First Name"
              value={firstName}
              onKeyDown={registerOnEnter}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <label htmlFor="firstNameInput">First Name</label>
          </div>
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              size={50}
              id="lastNameInput"
              placeholder="Last Name"
              value={lastName}
              onKeyDown={registerOnEnter}
              onChange={(event) => setLastName(event.target.value)}
            />
            <label htmlFor="lastNameInput">Last Name</label>
          </div>
          <AuthenticationFields
            onKeyDown={registerOnEnter}
            alias={alias}
            password={password}
            setAlias={setAlias}
            setPassword={setPassword}
          />
          <div className="form-floating mb-3">
            <input
              type="file"
              className="d-inline-block py-5 px-4 form-control bottom"
              id="imageFileInput"
              onKeyDown={registerOnEnter}
              onChange={handleFileChange}
            />
            {imageUrl.length > 0 && (
              <>
                <label htmlFor="imageFileInput">User Image</label>
                <img src={imageUrl} className="img-thumbnail" alt="" />
              </>
            )}
          </div>
        </>
      }
      switchAuthenticationMethod={
        <div className="mb-3">
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      }
      rememberMe={rememberMe}
      setRememberMe={setRememberMe}
      submitButtonDisabled={!canSubmit}
      isLoading={isLoading}
      submit={submit}
      onOAuthSelected={(provider) =>
        presenter.current!.showOAuthUnavailable(provider)
      }
    />
  );
};

export default Register;
