import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import withAuthRedirect from "@/components/withAuthRedirect";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Button, Box, Center, Divider, Heading, FormControl, Input, Loading, HelperMessage, ErrorMessage, Flex, Spacer} from "@yamada-ui/react";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async (e) => {
        setStatus("loading");
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/login`, {
                email: email,
                password: password
            },{
                withCredentials: true
            });
            
            if (response.data.success){
                login(response.data.user, response.data.token);
                setStatus("success");
            } else {
                const errorMessage = Array.isArray(response.data.error) 
                    ? response.data.error.join(', ')
                    : response.data.error || "Unknown Error";
                setMessage("Error:" + errorMessage);
                setStatus("failed")
            }
        }catch (error){
            console.error(error);
            setMessage("Error:" + error.response?.data?.error || "Unknown Error");
            setStatus("failed")
        }
    }

    const CSS = {
        form:{
            width: "80%",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        }
    }

    return (
        <>
            <Center p="xl">
                <Box m="md" p="md" rounded="md" style={CSS.form}>
                    <Flex p="md">
                        <Heading size="md">ログイン</Heading>
                        <Spacer />
                        <Button variant="link" colorScheme="white">
                            <Link href="/account/signup">
                                新規登録はこちら
                            </Link>
                        </Button>
                    </Flex>
                    <Divider />
                    {status === "loading" ? (
                        <Center p="2xl">
                            <Center>
                                <Flex direction="column" align="center">
                                        <Loading variant="puff" fontSize="8rem" color="cyan.500" p="md" />
                                        <Heading size="xl" p="md">処理中...</Heading>
                                </Flex>
                            </Center> 
                        </Center>
                    ): status === "success" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">
                                    ログインに成功しました
                                </Heading>
                                <Center p="md">
                                    <Link href="/">
                                        <Button variant="outline" colorScheme="cyan">
                                            ホームへ戻る
                                        </Button>
                                    </Link>
                                </Center>
                            </Flex>
                        </Center>
                    ): status === "failed" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">
                                    ログインに失敗しました
                                </Heading>
                                <Heading p="md">
                                    {message}
                                </Heading>
                                <Center p="md">
                                    <Button variant="outline" colorScheme="cyan" onClick={() => setStatus("idle")}>
                                        戻る
                                    </Button>
                                </Center>
                            </Flex>
                        </Center>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <Box p="md">
                                <FormControl  isRequired label="メールアドレス" p="md">
                                    <Input type="email" value={email} placeholder="メールアドレスを入力" onChange={(e) => setEmail(e.target.value)} required />
                                </FormControl>

                                <FormControl  isRequired label="パスワード" p="md">
                                    <Input type="password" value={password} placeholder="パスワードを入力" onChange={(e) => setPassword(e.target.value)} required />
                                </FormControl>
                                <Box p="md">
                                    <Link href="/account/resend_confirmation" paddingBotton= "1rem">
                                        確認メールが届いていない場合はこちら
                                    </Link>
                                    <br />
                                    <Link href="/account/reset_password">
                                        パスワードを忘れた場合はこちら
                                    </Link>
                                </Box>
                            </Box>
                            <Divider />
                            <Center p="md">
                                <Button type="submit" variant="outline" colorScheme="cyan">
                                    ログイン
                                </Button>
                            </Center>
                        </form>
                    )}
                </Box>
            </Center>
        </>
    );
}

export default withAuthRedirect(Login, "/");