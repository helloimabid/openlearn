import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Add a small delay to ensure auth state is updated
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          console.log("User is authenticated, redirecting to dashboard");
          navigate("/dashboard", { replace: true });
        } else {
          console.log("Authentication failed, redirecting to auth page");
          navigate("/auth", { replace: true });
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-t-2 border-b-2 border-teal-500 rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl text-white font-medium">
        Processing your login...
      </h2>
    </div>
  );
};

export default AuthCallback;
