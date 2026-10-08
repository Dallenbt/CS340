import { ReactNode } from "react";
import OAuth from "./OAuth";

interface Props {
  headingText: string;
  submitButtonLabel: string;
  oAuthHeading: string;
  inputFields: ReactNode;
  switchAuthenticationMethod: ReactNode;
  rememberMe: boolean;
  setRememberMe: (value: boolean) => void;
  submitButtonDisabled: boolean;
  isLoading: boolean;
  submit: () => void;
  onOAuthSelected: (provider: string) => void;
}

const AuthenticationFormLayout = (props: Props) => {
  return (
    <div className="center">
      <div className="form-main w-100 m-auto rounded">
        <form>
          <img
            className="mb-4"
            src="/bird-logo-64.png"
            alt=""
            width="72"
            height="72"
          />
          <h1 className="h3 mb-3 fw-normal">{props.headingText}</h1>
          {props.inputFields}
          <h1 className="h4 mb-3 fw-normal">Or</h1>
          <h1 className="h5 mb-3 fw-normal">{props.oAuthHeading}</h1>
          <OAuth onProviderSelected={props.onOAuthSelected} />
          <div className="checkbox mb-3">
            <label>
              <input
                type="checkbox"
                value="remember-me"
                checked={props.rememberMe}
                onChange={(event) => props.setRememberMe(event.target.checked)}
              />{" "}
              Remember me
            </label>
          </div>
          {props.switchAuthenticationMethod}
          <button
            id="submitButton"
            className="w-100 btn btn-lg btn-primary"
            type="button"
            disabled={props.submitButtonDisabled}
            onClick={props.submit}
          >
            {props.isLoading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <div>{props.submitButtonLabel}</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthenticationFormLayout;
