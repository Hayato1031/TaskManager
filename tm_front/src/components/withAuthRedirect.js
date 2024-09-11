// components/withAuthRedirect.js
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuthRedirect = (WrappedComponent, redirectTo = "/") => {
  return (props) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoggedIn) {
        router.replace(redirectTo);  // ログイン済みならリダイレクト
      }
    }, [isLoggedIn, router]);

    if (isLoggedIn) {
      return null; // ログイン済みなら何も表示しない
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthRedirect;