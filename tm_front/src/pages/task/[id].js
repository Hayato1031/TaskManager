import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Divider, Flex, Heading, Spacer } from "@yamada-ui/react";
import taskList from '@/constant/testdata/taskList';
import dailyTask from '@/constant/testdata/task';
import comments from '@/constant/testdata/taskComment';

export default function Task() {
  const router = useRouter();
  const { id } = router.query;

  // `id` を数値型に変換して比較
  const task = taskList.find((task) => task.id === Number(id));
  
  // `taskId`の一致は無視して、`dailyTaskId`のみでフィルタリング
  const relevantComments = comments.filter((comment) => comment.dailyTaskId !== undefined);

  // コメントがついているタスク
  const approvaldailyTask = dailyTask.filter((dailyTask) =>
    relevantComments.some((comment) => comment.dailyTaskId === dailyTask.id)
  );

  // コメントがついていないタスク
  const unapprovaldailyTask = dailyTask.filter((dailyTask) =>
    !relevantComments.some((comment) => comment.dailyTaskId === dailyTask.id)
  );

  // タスクステータスを表示用に変換、`task`が存在する場合のみアクセス
  const status = task ? (task.taskStatus ? "進行中" : "終了済") : "不明";

  const CSS = {
    flex: {
      alignItems: "center"
    },
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
    <Box p="xl">
      {task ? (
        <>
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

          <Box p="3rem">
            <Heading size="md">未承認タスク</Heading>
            <Divider />
            {unapprovaldailyTask.map((dailyTask) => (
              <Link key={dailyTask.id} href={`/task/${id}/${dailyTask.id}`}>
                <Box key={dailyTask.id} p="1rem" style={CSS.box}>
                  <Heading size="sm" p="md">タスク:{dailyTask.date}</Heading>
                  <Divider />
                  <Box p="md">
                    {dailyTask.content}
                  </Box>
                  <Box p="md">
                    未承認 - コメント無し
                  </Box>
                </Box>
              </Link>
            ))}
          </Box>

          <Box p="3rem">
            <Heading size="md">承認済みタスク</Heading>
            <Divider />
            {approvaldailyTask.map((dailyTask) => (
              <Box key={dailyTask.id} p="1rem" style={CSS.box}>
              <Heading size="sm" p="md">タスク:{dailyTask.date}</Heading>
              <Divider />
              <Box p="md">
                {dailyTask.content}
              </Box>
              <Box p="md">
                承認 - コメントあり
              </Box>
            </Box>
            ))}
          </Box>
        </>
      ) : (
        <Heading size="md">タスクが見つかりませんでした</Heading>
      )}
    </Box>
  );
}