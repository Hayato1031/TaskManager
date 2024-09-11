import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import withAuthRedirect from "@/components/withAuthRedirect";
import { Button, Box, Center, Divider, Heading, FormControl, Input, Label, HelperMessage, ErrorMessage, Flex, Spacer, Loading} from "@yamada-ui/react";

function Signup() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirm] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleRegister = async (e) => {
        setStatus("loading");
        e.preventDefault();
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/register`, {
                email: email,
                name: username,
                password: password,
                password_confirmation: password_confirmation
            },{
                withCredentials: true
            });

            if (response.data.success){
                setStatus("success");
            }
        } catch (error){
            console.error(error);
            const errorMessage = error.response?.data?.error?.join(', ') || "Unknown Error";
            setMessage("Error:" + errorMessage);
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
                        <Heading size="md">新規登録</Heading>
                        <Spacer />
                        <Button variant="link" colorScheme="white">
                            <Link href="/account/login">
                                ログインはこちら
                            </Link>
                        </Button>
                    </Flex>
                    <Divider />
                    {status === "success" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading size="xl" p="md">
                                    仮登録に成功しました
                                </Heading>
                                <br />
                                <Heading size="md" p="md">
                                    <Center>
                                        メールを確認して本登録を完了してください
                                    </Center>
                                </Heading>
                                <Divider />
                                <Box p="md">
                                    <Link href="/account/resend_confirmation">
                                        確認メールが届いていない方はこちら
                                    </Link>
                                </Box>
                            </Flex>
                        </Center>
                    ) : status === "failed" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">
                                    新規登録に失敗しました
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
                    ) : status === "loading" ? (
                        <Center p="2xl">
                            <Center>
                                <Flex direction="column" align="center">
                                        <Loading variant="puff" fontSize="8rem" color="cyan.500" p="md" />
                                        <Heading size="xl" p="md">処理中...</Heading>
                                </Flex>
                            </Center> 
                        </Center>
                    ) : (
                        <form onSubmit={handleRegister}>
                            <Box p="md">
                                <FormControl  isRequired label="メールアドレス" p="md">
                                    <Input type="email" placeholder="メールアドレスを入力" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </FormControl>

                                <FormControl  isRequired label="ユーザー名" p="md">
                                    <Input type="text" placeholder="ユーザー名を入力"  value={username} onChange={(e) => setUsername(e.target.value)} />
                                </FormControl>

                                <FormControl  isRequired label="パスワード"  p="md">
                                    <Input type="password" placeholder="パスワードを入力"  value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <HelperMessage color="white">6文字以上のパスワードにしてください。</HelperMessage>
                                </FormControl>

                                <FormControl  isRequired label="確認用パスワード" p="md">
                                    <Input type="password" placeholder="パスワードをもう一度入力" value={password_confirmation} onChange={(e) => setPasswordConfirm(e.target.value)} />
                                </FormControl>
                            </Box>
                            <Divider />
                            <Center p="md">
                                <Button type="submit" variant="outline" colorScheme="cyan">
                                    新規登録
                                </Button>
                            </Center>
                        </form>
                    ) 
                    }
                </Box>
            </Center>
        </>
    );
}

export default withAuthRedirect(Signup, "/");