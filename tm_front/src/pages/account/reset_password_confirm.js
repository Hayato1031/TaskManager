// pages/account/reset_password_confirm.js

import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { Box, Button, Center, Divider, Flex, FormControl, Input, Heading } from '@yamada-ui/react';

export default function ResetPasswordConfirm() {
    const router = useRouter();
    const { reset_password_token } = router.query;
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/password`, {
                user: {
                    reset_password_token: reset_password_token,
                    password: password,
                    password_confirmation: passwordConfirmation
                }
            });
            if (response.data.success) {
                setStatus('success');
                setMessage('パスワードがリセットされました。');
            } else {
                setStatus('failed');
                setMessage('Error: ' + response.data.errors.join(', '));
            }
        } catch (error) {
            setStatus('failed');
            const errorMessage = error.response?.data?.errors || "Unknown Error";
            setMessage('Error: ' + errorMessage);
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
                    <Heading size="xl" p="md">パスワード再設定</Heading>
                    <Divider />
                    {status === 'success' ? (
                        <Center p="md">
                            <Heading p="md">{message}</Heading>
                        </Center>
                    ) : status === 'failed' ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">パスワード再設定に失敗しました</Heading>
                                <Heading p="md">{message}</Heading>
                                <Center p="md">
                                    <Button variant="outline" colorScheme="cyan" onClick={() => setStatus('idle')}>
                                        戻る
                                    </Button>
                                </Center>
                            </Flex>
                        </Center>
                    ) : status === 'loading' ? (
                        <Center p="2xl">
                            <Heading size="xl" p="md">処理中...</Heading>
                        </Center>
                    ) : (
                        <form onSubmit={handleReset}>
                            <Box p="md">
                                <FormControl isRequired label="新しいパスワード" p="md">
                                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </FormControl>
                                <FormControl isRequired label="新しいパスワード（確認）" p="md">
                                    <Input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                                </FormControl>
                            </Box>
                            <Divider />
                            <Center>
                                <Box p="md">
                                    <Button type="submit" variant="outline" colorScheme="cyan">パスワードをリセット</Button>
                                </Box>
                            </Center>
                        </form>
                    )}
                </Box>
            </Center>
        </>
    );
}