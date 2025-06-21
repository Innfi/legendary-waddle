import { type CredentialResponse, GoogleLogin } from "@react-oauth/google";

export function GoogleLoginPage() {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    console.log(`clientId: ${credentialResponse.clientId}`);
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