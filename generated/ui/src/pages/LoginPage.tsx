import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse: any) => {
    console.log(credentialResponse);
    // Send the credentialResponse.credential to your backend for verification
    navigate('/dashboard');
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <div>
      <h1>Login Page</h1>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
};

export default LoginPage;
