import { useRouter } from 'next/router';
import { Box, Button, Center, Divider, Flex, FormControl, Text, Textarea, Heading, Input, Loading, Spacer } from '@yamada-ui/react';
import { DatePicker } from "@yamada-ui/calendar"
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TaskCreate() {
    const router = useRouter();
    const { id } = router.query;

    const [task, setTask] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const [date, setDate] = useState(null);
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [notice, setNotice] = useState("");
    const [nextAction, setNextAction] = useState("");

    const CSS = {
        box: {
            margin: "1rem",
            padding: "1rem",
            width: "90vw",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        },
    }

    useEffect(() => {
        if (id) {
            setLoading(true); // ローディング開始
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`)
                .then((response) => {
                    setTask(response.data.task);
                    setError(null); // エラーをリセット
                })
                .catch((error) => {
                    setTask(null); // タスクをnullに設定
                    setError("タスクを取得できませんでした。"); // エラーメッセージを設定
                })
                .finally(() => {
                    setLoading(false); // ローディング終了
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(id);
        const data = {
            date: date,
            summary: summary,
            content: content,
            notice: notice,
            next_action: nextAction,
            task_id: id,
            approved: false
        }

        try {
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily_reports`, data);
            if (response.data.status) {
                router.push(`/task/${id}`);
            } else {
                setError("進捗報告に失敗しました。?");
                setLoading(false);
            }
        } catch (error) {
            setError("進捗報告に失敗しました。1");
            setLoading(false);
        }

    }

    return (
        <Box p="xl">
            <Box style={CSS.box}>
                {loading ? ( 
                    <Flex justify="center" align="center" height="100px">
                        <Loading />
                    </Flex>
                ) : error ? (
                    <>
                        <Flex>
                            <Heading size="lg" p="md">
                                進捗報告作成
                            </Heading>
                        </Flex>
                        <Divider />
                        <Heading size="md" p="md">
                            {error}
                        </Heading>
                        <Center p="md">
                            <Button onClick={() => {setError(null)}}>
                                戻る
                            </Button>
                        </Center>
                    </>
                ) : (
                    <>
                        <Flex align="center">
                            <Heading size="lg" p="md">
                                進捗報告作成
                            </Heading>
                            <Spacer />
                            <Heading size="md" p="md">
                                メンバー: {task.member} さん
                            </Heading>
                        </Flex>
                        <Divider />
                        <Box p="md">
                            <form onSubmit={handleSubmit}>
                                <FormControl label="進捗を出した日" p="md" isRequired>
                                    <DatePicker placeholder="basic" value={date} onChange={(newDate) => {setDate(newDate)}} />
                                </FormControl>
                                <FormControl label="今日の進捗-概要" p="md" isRequired>
                                    <Input type="text" placeholder="今日の進捗の概要" value={summary} onChange={(e) => {setSummary(e.target.value)}} />
                                </FormControl>
                                <FormControl label="今日の進捗-詳細" p="md" isRequired>
                                    <Textarea autosize minRows={3} placeholder="今日の進捗の詳細" value={content} onChange={(e) => {setContent(e.target.value)}}>
                                    </Textarea>
                                </FormControl>
                                <FormControl label="今日の気づき" p="md">
                                    <Textarea autosize minRows={3} placeholder="今日の気づき・学び" value={notice} onChange={(e) => {setNotice(e.target.value)}}>
                                    </Textarea>
                                </FormControl>
                                <FormControl label="ネクストアクション" p="md">
                                    <Textarea autosize minRows={3} placeholder="ネクストアクション" value={nextAction} onChange={(e) => {setNextAction(e.target.value)}}>
                                    </Textarea>
                                </FormControl>
                                <Divider />
                                <Center>
                                    <Button m="md" type="submit">
                                        進捗報告
                                    </Button>
                                </Center>
                            </form>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    )
}