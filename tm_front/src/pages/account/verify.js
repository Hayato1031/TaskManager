import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Center, Button, Divider, Flex, Heading } from "@yamada-ui/react"
import axios, { all } from 'axios';

export default function Verify() {
    const router = useRouter();
    const  { confirmation_token } = router.query; 
    const [message, setMessage] = useState('認証中...');

    const CSS = {
        box: {
            alignItems: "center",
            margin: "1rem",
            padding: "10rem",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        },
        flex: {
            alignItems: "center"
        },
        messageBox: {
            
        }
    }

    useEffect(() => {
        if (confirmation_token) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/confirmation?confirmation_token=${confirmation_token}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        setMessage('認証が完了しました');
                    } else if (res.data.errors) {
                        // エラーが存在する場合の処理
                        setMessage('認証に失敗しました: ' + res.data.errors.join(', '));
                    } else {
                        // 予期しないレスポンスの場合の処理
                        setMessage('認証に失敗しました: Unknown error');
                    }
                })
                .catch((err) => {
                    // エラーの詳細が存在する場合と、存在しない場合の処理
                    const errorMessage = err.response?.data?.errors?.join(', ') || err.response?.data?.error || err.message;
                    setMessage('認証に失敗しました: ' + errorMessage);
                });
        }
    }, [confirmation_token]);

    return (
        <Box p="md">
            <Box style={CSS.box}>
                <Flex direction={"column"} gap="md" style={CSS.flex} >
                    <Box p="md" style={CSS.messageBox}>
                        <Heading>
                            {message}
                        </Heading>
                    </Box>
                    <Divider />
                    <Link href="/">
                        <Button variant="outline" colorScheme='cyan'>ホームへ戻る</Button>
                    </Link>
                </Flex>
            </Box>
        </Box>
    )

}