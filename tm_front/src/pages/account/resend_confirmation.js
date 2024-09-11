import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Box, Button, Center, Flex, FormControl, Input, Loading, Heading, Divider } from '@yamada-ui/react';

export default function ResendConfirmation() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const handleResend = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/confirmation`, {
                email: email,
            },{
                withCredentials: true
            });
            if(response.data.success){
                setStatus("success");
            } else {
                setStatus("failed");
                const errorMessage = response.data.error || "Unknown Error";
                setMessage("Error: " + errorMessage);
            }
        } catch (error) {
            setStatus("failed");
            const errorMessage = error.response?.data?.error || "Unknown Error";
            setMessage("Error: " + errorMessage);
        }
    }

    const CSS = {
        box:{
            width: "80%",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        },
        form: {
            width: "100%"
        }
    }

    return (
        <>  
            <Center p="xl" >
                <Box p="md" style={CSS.box}>
                    <Box p="md">
                        <Heading size="md">
                            確認メール再送信
                        </Heading>
                    </Box>
                    <Divider />
                    { status === "loading" ? (
                        <Center p="2xl">
                            <Center>
                                <Flex direction="column" align="center">
                                        <Loading variant="puff" fontSize="8rem" color="cyan.500" p="md" />
                                        <Heading size="xl" p="md">処理中...</Heading>
                                </Flex>
                            </Center> 
                        </Center>
                    ) : status === "success" ? (
                        <Center p="md">
                                <Flex direction="column" align="center">
                                    <Heading p="md">
                                        確認メールを再送信しました。
                                    </Heading>
                                    <Center p="md">
                                        <Link href="/account/login">
                                            <Button variant="outline" colorScheme="cyan">
                                                ログインへ戻る
                                            </Button>
                                        </Link>
                                    </Center>
                                </Flex>
                            </Center>
                    ) : status === "failed" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">
                                    再送信に失敗しました
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
                        <Box p="md">
                            <form onSubmit={handleResend}>
                                <Box p="md">
                                    アカウントの認証メールを再送信します。メールアドレスを入力してください。
                                </Box>
                                <Center>
                                    <Flex direction="column" style={CSS.form}>
                                        <Box p="md">
                                            <FormControl label="メールアドレスを入力">
                                                <Input type="email" placeholder="メールアドレス" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                                            </FormControl>
                                        </Box>
                                        <Divider />
                                        <Center>
                                            <Box p="md">
                                                <Button type="submit" variant="outline" colorScheme="cyan">確認メールを再送信</Button>
                                            </Box> 
                                        </Center> 
                                    </Flex>
                                </Center>
                            </form>
                        </Box>
                    )
                    }
                </Box>
            </Center>
        </>
    );
}