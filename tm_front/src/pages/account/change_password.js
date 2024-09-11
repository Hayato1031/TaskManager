import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Center, Divider, Flex, FormControl, Heading, Input, Text } from "@yamada-ui/react";

export default function ChangePassword() {
    const { user, token } = useAuth();
    const [current_password, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");

    const CSS = {
        box: {
            width: "80%",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        },
    }

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update_password`, {
                user: {
                    current_password: current_password,
                    password: password,
                    password_confirmation: password_confirmation
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (response.data.success) {
                setMessage("パスワードが変更されました。");
            } else {
                const errorMessage = response.data.error || "Unknown Error";
                setMessage("Error: " + errorMessage);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Unknown Error";
            setMessage("Error: " + errorMessage);
        }
    };

    return (
        <Center p="xl">
            <Box style={CSS.box} p="md">
                <Heading size="xl" p="md">パスワード変更</Heading>
                <Divider />
                <Box p="md">
                    <form onSubmit={handleChangePassword}>
                        <FormControl label="現在のパスワード" isRequired p="md">
                            <Input type="password" value={current_password} placeholder="現在のパスワード" onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </FormControl>
                        <FormControl label="新しいパスワード" isRequired p="md">
                            <Input type="password" value={password} placeholder="新しいパスワード" onChange={(e) => setPassword(e.target.value)} required />
                        </FormControl>
                        <FormControl label="新しいパスワード(確認用)" isRequired p="md">
                            <Input type="password" value={password_confirmation} placeholder="新しいパスワード(確認用)" onChange={(e) => setPasswordConfirmation(e.target.value)} required />
                        </FormControl>
                        <Center>
                            <Button m="md" variant="outline" colorScheme="cyan" type="submit">
                                パスワードを変更
                            </Button>
                        </Center>
                    </form>
                    <Center>
                        {message && <Text color="red.500">{message}</Text>}
                    </Center>
                </Box>
            </Box>
        </Center>
    );
}