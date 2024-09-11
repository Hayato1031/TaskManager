// components/withAuthRedirect.js
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuthRedirect = (WrappedComponent, redirectTo = "/") => {
  // WrappedComponentをラップするWithAuthRedirectコンポーネント
  const WithAuthRedirect = (props) => {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoggedIn) {
        router.replace(redirectTo);  // ログイン済みならリダイレクト
      }
    }, [isLoggedIn, router, redirectTo]);

    if (isLoggedIn) {
      return null; // ログイン済みなら何も表示しない
    }

    return <WrappedComponent {...props} />;
  };

  // displayNameを設定
  WithAuthRedirect.displayName = `withAuthRedirect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithAuthRedirect;
};

export default withAuthRedirect;