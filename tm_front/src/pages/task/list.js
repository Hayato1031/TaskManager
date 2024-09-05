import Link from "next/link";
import { Box, Center, Container, Flex, Divider, Heading } from "@yamada-ui/react";
import taskList from "@/constant/testdata/taskList";

export default function TaskList() {
    const allTaskList = taskList;
    const progressTaskList = taskList.filter((task) => task.taskStatus == true);
    const unprogressTaskList = taskList.filter((task) => task.taskStatus == false);

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
        flex: {
            justifyContent: "space-between",
            alignItems: "center"
        }
    }

    return (
        <>  
            <Box p="xl">
                <Heading size="md" m="0.5rem">
                    管理タスク一覧 - 進行中
                </Heading>
                <Divider  />
                <Center>
                    <Box p="1rem">
                        { progressTaskList.map((task) => (
                            <Link key={task.id} href={`/task/${task.id}`}>
                                <Box key={task.id} style={CSS.box}>
                                    <Flex style={CSS.flex}>
                                        <Heading size="md">
                                            タスク:{task.title}
                                        </Heading>
                                        {task.member}さん
                                    </Flex>
                                    <Divider />
                                    <Box p="md">
                                        未承認タスク:{task.unapprovalTask}<br />
                                        承認済みタスク:{task.approvalTask}
                                    </Box>
                                </Box>
                            </Link>
                        ))
                        }
                    </Box>
                </Center>
            </Box>
            <Box p="xl">
                <Heading size="md" m="0.5rem">
                    管理タスク一覧 - 終了済
                </Heading>
                <Divider  />
                <Center>
                    <Box p="1rem">
                        { unprogressTaskList.map((task) => (
                            <Link key={task.id} href={`/task/${task.id}`}>
                                <Box key={task.id} style={CSS.box}>
                                    <Flex style={CSS.flex}>
                                        <Heading size="md">
                                            タスク:{task.title}
                                        </Heading>
                                        {task.member}さん
                                    </Flex>
                                    <Divider />
                                    <Box p="md">
                                        未承認タスク:{task.unapprovalTask}<br />
                                        承認済みタスク:{task.approvalTask}
                                    </Box>
                                </Box>
                            </Link>
                            
                        ))
                        }
                    </Box>
                </Center>
            </Box>
        </>
    );
}