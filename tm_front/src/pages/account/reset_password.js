// pages/account/reset_password.js

import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Center, Flex, FormControl, Input, Loading, Heading, Divider } from '@yamada-ui/react';

export default function ResetPasswordRequest() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");

    const handleRequest = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/password`, {
                user: { email: email }
            });
            if(response.data.success){
                setStatus("success");
                setMessage("パスワードリセットのメールを送信しました。");
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
            <Center p="xl">
                <Box p="md" style={CSS.box}>
                    <Heading size="xl" p="md">
                        パスワードリセットリクエスト
                    </Heading>
                    <Divider />
                    { status === "loading" ? (
                        <Center p="2xl">
                            <Loading variant="puff" fontSize="8rem" color="cyan.500" p="md" />
                            <Heading size="xl" p="md">処理中...</Heading>
                        </Center>
                    ) : status === "success" ? (
                        <Center p="md">
                            <Heading p="md">
                                {message}
                            </Heading>
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
                        <form onSubmit={handleRequest}>
                            <Box p="md">
                                パスワードリセットのメールを送信します。メールアドレスを入力してください。
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
                                            <Button type="submit" variant="outline" colorScheme="cyan">リセットリンクを送信</Button>
                                        </Box> 
                                    </Center> 
                                </Flex>
                            </Center>
                        </form>
                    )}
                </Box>
            </Center>
        </>
    );
}