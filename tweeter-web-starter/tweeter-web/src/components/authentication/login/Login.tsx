import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage, displayInfoMessage, deleteMessage } =
    useMessageActions();

  const presenter = useRef<LoginPresenter | null>(null);
  if (!presenter.current) {
    const PresenterConstructor = LoginPresenter as new (dependencies: {
      setLoading: typeof setIsLoading;
      updateUserInfo: typeof updateUserInfo;
      navigate: typeof navigate;
      displayInfoMessage: typeof displayInfoMessage;
      displayErrorMessage: typeof displayErrorMessage;
      deleteMessage: typeof deleteMessage;
    }) => LoginPresenter;
    presenter.current = new PresenterConstructor({
      setLoading: setIsLoading,
      updateUserInfo,
      navigate,
      displayInfoMessage,
      displayErrorMessage,
      deleteMessage,
    });
  }

  const canSubmit = presenter.current.canSubmit(alias, password);
  const submit = () =>
    void presenter.current!.login(alias, password, rememberMe, props.originalUrl);
  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && canSubmit) {
      submit();
    }
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFields={
        <AuthenticationFields
          onKeyDown={loginOnEnter}
          alias={alias}
          password={password}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      }
      switchAuthenticationMethod={
        <div className="mb-3">
          Not registered? <Link to="/register">Register</Link>
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

export default Login;
