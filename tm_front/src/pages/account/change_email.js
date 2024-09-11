import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { Box, Button, Center, Divider, Flex, FormControl, Heading, Input, Text } from "@yamada-ui/react";

export default function ChangeEmail() {
    const { user, token } = useAuth();
    const [newEmail, setNewEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
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

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update_email`, {
                user: {
                    email: newEmail,
                    current_password: currentPassword
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (response.data.success) {
                setMessage("確認メールが新しいメールアドレスに送信されました。確認を完了してください。");
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
                <Heading size="xl" p="md">メールアドレス変更</Heading>
                <Divider />
                <Box p="md">
                    <form onSubmit={handleChangeEmail}>
                        <FormControl label="新しいメールアドレス" isRequired p="md">
                            <Input type="email" value={newEmail} placeholder="新しいメールアドレス" onChange={(e) => setNewEmail(e.target.value)} required />
                        </FormControl>
                        <FormControl label="現在のパスワード" isRequired p="md">
                            <Input type="password" value={currentPassword} placeholder="現在のパスワード" onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </FormControl>
                        <Center>
                            <Button m="md" variant="outline" colorScheme="cyan" type="submit">
                                メールアドレスを変更
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