import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Divider, Heading, Flex, Spacer } from "@yamada-ui/react";

export default function Layout({ children }) {
    const { isLoggedIn, loading, logout, user } = useAuth();

    const CSS = {
        header: {
            alignItems: "center",
            padding: "0 20px",
            position: "fixed",
            zIndex: 1,
            top: 0,
            background: "rgba( 255, 255, 255, 0.8 )",
            boxShadow: "0 8px 32px 0 rgba( 31, 38, 135, 0.37 )",
            backdropFilter: "blur( 7px )",
            border: "1px solid rgba( 255, 255, 255, 0.18 )"
        },
        main: {
            marginTop: "54px"
        },
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <header>
                <Flex w="full" gap="md" style={CSS.header}>
                    <Link href="/">
                        <Heading size="2xl" bgGradient="linear(to-l, #9D38F0, #EF6786)" bgClip="text" isTruncated>
                            TaskManager
                        </Heading>
                    </Link>
                    <Spacer />
                    {isLoggedIn ? (
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link href="/account/profile">こんにちは、{user?.name}さん</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link href="/task/list">管理タスク一覧</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link href="/" onClick={logout}>ログアウト</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    ):(
                        <Breadcrumb>
                            <BreadcrumbItem>
                                <Link href="/">ホーム</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link href="/account/login">ログイン</Link>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <Link href="/account/signup">新規登録</Link>
                            </BreadcrumbItem>
                        </Breadcrumb>
                    )}  
                </Flex>
            </header>
            <Divider />
            <main style={CSS.main} className="page-content">
                {children}
            </main>
        </div>
    );
}