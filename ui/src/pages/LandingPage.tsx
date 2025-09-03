import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

import { Button } from '../components/Button'
import { usePostLogin } from '../components/auth/api';

function LandingPage() {
  const navigate = useNavigate();
  const postLogin = usePostLogin(navigate);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => postLogin.mutate(tokenResponse.access_token),
  });

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="flex flex-col min-h-screen max-w-sm mx-auto px-6 border border-border">
        {/* Upper section with kettlebell logo */}
        <div className="pt-12 pb-6 flex justify-center">
          <svg className="w-12 h-12 text-foreground" viewBox="0 0 64 64" fill="none">
            {/* Kettlebell handle */}
            <rect x="26" y="8" width="12" height="20" rx="6" fill="currentColor" />
            {/* Kettlebell bell */}
            <circle cx="32" cy="40" r="16" fill="currentColor" />
            {/* Handle opening */}
            <rect x="28" y="12" width="8" height="12" rx="4" fill="var(--background)" />
          </svg>
        </div>

        {/* Main content area */}
        <div className="flex items-center justify-center">
          <div className="text-center space-y-8">
            <h1 className="text-4xl tracking-tight">
              legenary-waddle
            </h1>
            <p className="text-muted-foreground text-lg">
              record your workouts 
            </p>
          </div>
        </div>

        {/* Bottom section with Google login */}
        <div className="pb-8 pt-4">
          <Button 
            onClick={() => login()}
            className="w-full bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-3 py-6"
            size="lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
