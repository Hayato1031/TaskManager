import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { Box, Button, Center, Heading, Divider, FormControl, Input, Textarea, Flex, Loading } from "@yamada-ui/react";

export default function TaskCreate() {
    const { token } = useAuth();
    const router = useRouter(); // 修正: useRouter フックを使用
    const [title, setTitle] = useState('');
    const [member, setMember] = useState('');
    const [goal, setGoal] = useState('');
    const [description, setDescription] = useState('');

    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        setStatus("loading"); // ステータスを "loading" に設定
        const data = {
            title: title,
            member: member,
            goal: goal,
            description: description
        }
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks`, {
                task: data // 修正: user ではなく task として送信
            },{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (response.data.success){
                router.push(`/task/${response.data.task.id}`); // 修正: Router ではなく router を使用
            } else {
                setStatus("failed");
                const errorMessage = "Error: " + (response.data.error || "Unknown Error");
                setMessage(errorMessage);
            }
        } catch (error) {
            setStatus("failed");
            const errorMessage = "Error: " + (error.response?.data?.error || "Unknown Error");
            setMessage(errorMessage);
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
        flex: {
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }
    }
    
    return (
        <Box p="xl">
            <Center p="md">
                <Box style={CSS.box} p="md">
                    <Heading size="xl" p="md">タスク作成</Heading>
                    <Divider />
                    {status === "failed" ? (
                        <Center p="md">
                            <Flex direction="column" align="center">
                                <Heading p="md">
                                    エラーが発生しました。
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
                    ): status === "loading" ? (
                        <Center p="2xl">
                            <Center>
                                <Flex direction="column" align="center">
                                        <Loading variant="puff" fontSize="8rem" color="cyan.500" p="md" />
                                        <Heading size="xl" p="md">処理中...</Heading>
                                </Flex>
                            </Center> 
                        </Center>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <Box p="md">
                                <FormControl label="タイトル" p="md" isRequired>
                                    <Input type="text" placeholder="タスク名を入力してください。" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                                </FormControl>

                                <FormControl label="タスクを行うメンバー名" p="md" isRequired>
                                    <Input type="text" placeholder="メンバー名を入力してください。" value={member} onChange={(e) => {setMember(e.target.value)}} />
                                </FormControl>

                                <FormControl label="タスクの目標" p="md">
                                    <Textarea autosize minRows={3} placeholder="タスクの目標を入力してください。" value={goal} onChange={(e) => {setGoal(e.target.value)}} />
                                </FormControl>

                                <FormControl label="タスクの説明" p="md">
                                    <Textarea autosize minRows={3} placeholder="タスクの説明を入力してください。" value={description} onChange={(e) => {setDescription(e.target.value)}} />
                                </FormControl>
                            </Box>
                            <Divider />
                            <Center>
                                <Button m="md" type="submit" variant="outline" color="white">
                                    タスクを作成
                                </Button>
                            </Center>
                        </form>
                    )}
                </Box>
            </Center>
        </Box>
    );
}