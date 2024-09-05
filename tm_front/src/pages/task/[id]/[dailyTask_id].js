import { useRouter } from 'next/router';
import taskPageData from '@/constant/testdata/taskPage';
import { Box, Divider, Flex, Heading, Spacer } from "@yamada-ui/react";

export default function DailyTask() {
    const router = useRouter();
    const {id, dailyTask_id} = router.query;

    const task = taskPageData.task;
    const dailyTask = taskPageData.dailyTask;
    const comments = taskPageData.comments;

    const status = dailyTask.taskStatus ? "進行中" : "終了済";
    
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
        }
      };

    return (
        <>
            <Box p="3rem">
                <Flex style={CSS.flex}>
                    <Heading size="xl" m="0.5rem">
                    {task.title} - {status}
                    </Heading>
                    <Spacer />
                    <Heading size="md" m="0.5rem">
                    {task.member}さん
                    </Heading>
                </Flex>
                <Divider />

                <Box p="1rem" style={CSS.box}>
                    <Heading size="xl">
                        {dailyTask.date}
                    </Heading>
                    <Divider />
                    <Box p="md">
                        <Heading size="md">
                            {dailyTask.content}
                        </Heading>
                    </Box>
                </Box>
            </Box>
        </>
    )
}