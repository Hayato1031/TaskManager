import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { Box, Button, Center, Container, Flex, Divider, Heading, Spacer } from "@yamada-ui/react";

export default function TaskList() {
    const { token } = useAuth();
    const [taskList, setTaskList] = useState([]);
    const progressTaskList = taskList.filter((task) => task.status == true);
    const unprogressTaskList = taskList.filter((task) => task.status == false);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks`, { 
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true
        })
        .then((response) => {
            if (response.data.success) {
                setTaskList(response.data.tasks);
                {console.log(taskList)}
            } else {
                setTaskList([]);
            }
        })
        .catch((error) => {
            setTaskList([]);
        });
    }, []);

    const CSS = {
        box: {
            margin: "1rem",
            padding: "1rem",
            width: "100%",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        },
        flex: {
            justifyContent: "space-between",
            alignItems: "center"
        }
    }

    return (
        <>  
            <Box p="xl">
                <Flex align="center">
                    <Heading p="md" size="xl">
                        管理タスク一覧
                    </Heading>
                    <Spacer />
                    <Link href="/task/create">
                        <Button variant="outline" colorScheme="white">
                            新規タスク作成
                        </Button>
                    </Link>
                </Flex>       
                <Divider />
                <Box p="xl">
                    <Heading size="xl" p="md">
                        進行中
                    </Heading>
                    <Divider  />
                    <Center>
                        <Box p="1rem" width="100%">
                            { progressTaskList.length == 0 ? (
                                <Center>
                                    <Heading size="md">
                                        進行中のタスクはありません。
                                    </Heading>
                                </Center>
                            ) : (
                                progressTaskList.map((task) => (
                                    <Link key={task.id} href={`/task/${task.id}`}>
                                        <Box key={task.id} style={CSS.box} p="md">
                                            <Flex style={CSS.flex} width="100%">
                                                <Heading size="md" p="md">
                                                    タスク:{task.title}
                                                </Heading>
                                                {task.member}さん
                                            </Flex>
                                            <Divider />
                                            <Box p="md">
                                                ステータス:進行中
                                            </Box>
                                        </Box>
                                    </Link>
                                ))
                            )
                            }
                        </Box>
                    </Center>
                </Box>
                <Box p="xl">
                    <Heading size="xl" p="md">
                        終了済
                    </Heading>
                    <Divider  />
                    <Center>
                        <Box p="1rem" width="100%">
                        { unprogressTaskList.length == 0 ? (
                                <Center>
                                    <Heading size="md">
                                        進行中のタスクはありません。
                                    </Heading>
                                </Center>
                            ) : (
                                unprogressTaskList.map((task) => (
                                    <Link key={task.id} href={`/task/${task.id}`}>
                                        <Box key={task.id} style={CSS.box} p="md">
                                            <Flex style={CSS.flex} width="100%">
                                                <Heading size="md" p="md">
                                                    タスク:{task.title}
                                                </Heading>
                                                {task.member}さん
                                            </Flex>
                                            <Divider />
                                            <Box p="md">
                                                ステータス:終了済み
                                            </Box>
                                        </Box>
                                    </Link>
                                ))
                            )
                            }
                        </Box>
                    </Center>
                </Box>
            </Box>
        </>
    );
}