import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export function GoogleLoginPage() {
  const handleSuccess = (credentialResponse: CredentialResponse) => {

  };

  const handleError = () => {
    // no response code?
    console.log(`login failed`);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        // flow="auth-code" // useGoogleLogin maybe?
      />
    </div>
  );
};