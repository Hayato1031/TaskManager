import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, Center, Divider, Flex, FormControl, Heading, IconButton, Input, SegmentedControl, SegmentedControlButton, Spacer, Tabs, Tab, TabPanel, Textarea, useDisclosure, Menu, MenuButton, MenuList, MenuItem, Modal, ModalHeader, ModalBody, ModalFooter} from "@yamada-ui/react";
import { DatePicker } from "@yamada-ui/calendar"
import Link from 'next/link';
import { Divide, MenuIcon } from '@yamada-ui/lucide';
import { useAuth } from '@/contexts/AuthContext';

export default function DailyTask() {
    const router = useRouter();
    const {id, dailyTask_id} = router.query;

    const { user } = useAuth();

    const [status, setStatus] = useState("loading");
    const [task, setTask] = useState(null);
    const [dailyTask, setDailyTask] = useState(null);

    const [updateMessage, setUpdateMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [notice, setNotice] = useState("");
    const [nextAction, setNextAction] = useState("");

    const [admin, setAdmin] = useState(null);

    const [comments, setComments] = useState(null);

    const auth = task && user && task.user_id === user.id; // user が null でないことを確認
    const postUser = auth ? (admin ? admin.name : "不明") : (task ? task.member : ""); // task と task.user の存在を確認

    const [commentData, setCommentData] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if(dailyTask_id){
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily_reports/${dailyTask_id}`)
            .then((response) => {   
                if(response.data.status){
                    const data = response.data.data;
                    setDailyTask(data);
                    setTask(response.data.task);

                    // dailyTask ではなく data を使用
                    setSummary(data.summary);
                    setContent(data.content);
                    setNotice(data.notice);
                    setNextAction(data.next_action);
                    setStatus("loaded");

                    setAdmin(response.data.admin || {}); // adminがnullの場合は空オブジェクトを設定
                    setComments(response.data.comments);

                    console.log(dailyTask);
                } else {
                    setStatus("loaded"); // エラーハンドリング
                }
            })
            .catch((error) => {
                console.log(error);
                setStatus("loaded"); // エラーハンドリング
            });
        }
    }, [dailyTask_id, dailyTask]);


    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const data = {
            date: dailyTask.date,
            summary: summary,
            content: content,
            notice: notice,
            next_action: nextAction
        }
        axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily_reports/${dailyTask_id}`, data)
        .then((response) => {
            const data = response.data.data;
            setUpdateMessage("更新しました。");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily_reports/${dailyTask_id}`)
        .then((response) => {
            if(response.data.status){
                router.push(`/task/${id}`);
            } else {
                setDeleteMessage("削除できませんでした。");
            }
        })
        .catch((error) => {
            setDeleteMessage("削除できませんでした。");
        })
    }

    const handleApproved = async (value) => {
        const approved = value === "承認済み" ? true : false;
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/daily_reports/${dailyTask_id}`, { approved });
            setDailyTask((prev) => ({ ...prev, approved })); // 状態を更新
        } catch (error) {
            console.log(error);
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // フォームのデフォルト動作を防ぐ
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments`, {
                comment: {
                    content: commentData,
                    daily_report: dailyTask.id,
                    admin: auth
                }
            });
    
            if (response.data.status) {
                setCommentData("");
                onClose(); 
            } else {
                setDeleteMessage("コメントの投稿に失敗しました。");
            }
        } catch (error) {
            console.log(error);
            setDeleteMessage("コメントの投稿に失敗しました。");
        }
    }

    const formatDateToJST = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: 'Asia/Tokyo',
            hour12: false // 24時間形式
        };
        return date.toLocaleString('ja-JP', options);
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/comments/${commentId}`);
            if (response.data.status) {
                // コメントを削除した後、コメントリストを更新
                setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
            } else {
                console.log("コメントの削除に失敗しました。");
            }
        } catch (error) {
            console.log("削除エラー:", error);
        }
    };
    
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
        button: {
            position: "fixed",
            bottom: "2rem",
            right: "3rem"
        }
      };

    return (
        <>
            <Box p="xl">
                {status === "loading" ? (
                    <>
                        Loading...
                    </>
                ) : status === "loaded" ? (
                    <>
                        <Center>
                            <Box style={CSS.box} p="xl">
                                <Link href={`/task/${id}`}>
                                    <Box p="md">
                                        Task: {task.title} - {task.member}
                                    </Box>
                                </Link>
                                <Heading size="xl" p="md" paddingTop="0">
                                    {dailyTask.date} - DailyReport
                                </Heading>
                                <Tabs variant="rounded-solid" p="md" colorScheme='white'>
                                    <Tab>
                                        ステータス
                                    </Tab>
                                    <Tab>
                                        編集
                                    </Tab>
                                    <Tab>
                                        設定
                                    </Tab>
                                
                                    <TabPanel>
                                        <Flex p="md" align="center">
                                            <Heading size="md" p="md" flex="1">
                                                ステータス:
                                            </Heading>
                                            <Box p="md" flex="3">
                                                {dailyTask.approved ? "承認済み" : "未承認"}
                                            </Box>
                                        </Flex>
                                        <Divider />
                                        <Flex p="md" align="center">
                                            <Heading size="md" p="md" flex="1">
                                                概要:
                                            </Heading>
                                            <Box p="md" flex="3">
                                                {dailyTask.summary}
                                            </Box>
                                        </Flex>
                                        <Divider />
                                        <Flex p="md" align="center">
                                            <Heading size="md" p="md" flex="1">
                                                詳細:
                                            </Heading>
                                            <Box p="md" flex="3">
                                                {dailyTask.content}
                                            </Box>
                                        </Flex>
                                        {dailyTask.notice ? (
                                            <>
                                                <Divider />
                                                <Flex p="md" align="center">
                                                    <Heading size="md" p="md" flex="1">
                                                        気づき:
                                                    </Heading>
                                                    <Box p="md" flex="3">
                                                        {dailyTask.notice}
                                                    </Box>
                                                </Flex>
                                            </>
                                        ) : (
                                            null
                                        )}
                                        {dailyTask.next_action ? (
                                            <>
                                                <Divider />
                                                <Flex p="md" align="center">
                                                    <Heading size="md" p="md" flex="1">
                                                        ネクストアクション:
                                                    </Heading>
                                                    <Box p="md" flex="3">
                                                        {dailyTask.next_action}
                                                    </Box>
                                                </Flex>
                                            </>
                                        ) : (
                                            null
                                        )}
                                    </TabPanel>

                                    <TabPanel>
                                        <form onSubmit={handleUpdateSubmit}>
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
                                            <Divider p="md" />
                                            <Center>
                                                <Button m="md" type="submit">
                                                    更新
                                                </Button>
                                            </Center>
                                            <Center>
                                                <Box p="md">
                                                    {updateMessage}
                                                </Box>
                                            </Center>
                                        </form>
                                    </TabPanel>

                                    <TabPanel>
                                        <Box p="md">
                                            <Heading size="md" p="md">
                                                進捗報告削除
                                            </Heading>
                                            <Divider />
                                            <Center>
                                                <Button colorScheme="red" m="md" onClick={handleDeleteSubmit}>
                                                    進捗報告を削除
                                                </Button>
                                            </Center>
                                            <Center>
                                                <Box p="md">
                                                    {deleteMessage}
                                                </Box>
                                            </Center>
                                        </Box>
                                    </TabPanel>
                                </Tabs>
                            </Box>
                        </Center>

                        {auth && (
                            <Box p="xl">
                                <Heading size="lg" p="md">
                                    承認確認
                                </Heading>
                                <Divider />
                                <Center>
                                    <SegmentedControl variant="rounded" p="md" m="md" size="lg" defaultValue={dailyTask.approved ? "承認済み" : "未承認"} onChange={handleApproved}>
                                        <SegmentedControlButton value="承認済み" color="white">
                                            承認済み
                                        </SegmentedControlButton>
                                        <SegmentedControlButton value="未承認" color="white">
                                            未承認
                                        </SegmentedControlButton>
                                    </SegmentedControl>
                                </Center>
                            </Box>
                        )}

                        <Box p="xl">
                            <Heading size="lg" p="md">
                                コメント
                            </Heading>
                            <Divider />
                            <Flex direction="column">
                                {comments && comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <Center key={comment.id}>
                                            <Box p="md" style={CSS.box}>
                                                <Box>
                                                    <Box>
                                                        <Flex align="center">
                                                            <Heading size="md" p="md">
                                                                {admin ? admin.name : comment.user ? comment.user.name : "不明"} {/* デフォルト値を設定 */}
                                                            </Heading>
                                                            <Spacer />
                                                            <Heading size="md" p="md">
                                                                {formatDateToJST(comment.created_at)}
                                                            </Heading>
                                                            <Menu>
                                                                <MenuButton
                                                                    as={IconButton}
                                                                    icon={<MenuIcon fontSize="2xl" />}
                                                                    variant="outline"
                                                                    colorScheme="white"
                                                                />
                                                                <MenuList>
                                                                    <MenuItem color="black" onClick={() => handleCommentDelete(comment.id)}>コメントを削除</MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </Flex>
                                                    </Box>
                                                    <Divider />
                                                    <Box p="md">
                                                        {comment.content}
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Center>
                                    ))
                                ) : (
                                    <Box p="md">
                                        コメントはありません。
                                    </Box>
                                )}
                            </Flex>
                        </Box>

                        <Button onClick={onOpen} style={CSS.button}>コメント投稿</Button>
                        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                            <form onSubmit={handleCommentSubmit}>
                                <ModalHeader>
                                    コメント投稿
                                </ModalHeader>
                                <ModalBody>
                                    <FormControl label="メンバー" p="md" isRequired isDisabled>
                                        <Input type="text" value={postUser} />
                                    </FormControl>
                                    <FormControl label="コメント" p="md" isRequired>
                                        <Textarea autosize minRows={3} placeholder="コメント" value={commentData} onChange={(e) => {setCommentData(e.target.value)}}>
                                        </Textarea>
                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    <Button onClick={onClose}>
                                        閉じる
                                    </Button>
                                    <Button colorScheme="blue" type="submit">
                                        投稿
                                    </Button>
                                </ModalFooter>
                            </form>
                        </Modal>
                    </>

                ) :(
                    null
                )
                }
            </Box>
        </>
    )
}