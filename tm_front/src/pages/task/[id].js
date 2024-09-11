import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axios from 'axios';
import { Accordion, AccordionItem, AccordionLabel, AccordionPanel, Box, Button, Center, Divider, Flex, FormControl, Heading, Spacer, Input, Tabs, Tab, TabPanel, SegmentedControl, SegmentedControlButton, Textarea, Modal, useDisclosure, ModalHeader, ModalBody, ModalFooter, useClipboard } from "@yamada-ui/react";
import { ArrowRight } from "@yamada-ui/lucide"

export default function Task() {
  const router = useRouter();
  const { id } = router.query;

  const currentDomain = window.location.origin;
  const url = `${currentDomain}/task/${id}`;
  const { onCopy, value, setValue, hasCopied } = useClipboard()

  const [task, setTask] = useState('');
  const [admin, setAdmin] = useState('');
  const [daily_reports, setDailyReports] = useState([]);

  const approvedDailyReports = daily_reports.filter((daily_report) => daily_report.approved == true);
  const unapprovedDailyReports = daily_reports.filter((daily_report) => daily_report.approved == false);

  const [message, setMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  const { token, user } = useAuth();

  const [title, setTitle] = useState('');
  const [member, setMember] = useState('');
  const [status, setStatus] = useState(true);
  const [goal, setGoal] = useState('');
  const [description, setDescription] = useState('');

  // タスク削除用モーダル
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if(id) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`)
      .then((response) => {
        if (response.data.success) {
          setTask(response.data.task);
          setAdmin(response.data.admin);
          setDailyReports(response.data.daily_reports);

          setTitle(response.data.task.title);
          setMember(response.data.task.member);
          setStatus(response.data.task.status);
          setGoal(response.data.task.goal);
          setDescription(response.data.task.description);
        } else {
          setTask(null);
        }
      })
      .catch((error) => {
        setTask(null);
      });
    }
  }, [id]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setMessage("送信中...");

    const data = {
      title: title,
      member: member,
      status: status,
      goal: goal,
      description: description
    }

    try {
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`, {
        task: data
      },{
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (response.data.success){
        setTask(response.data.task);
        setAdmin(response.data.admin);

        setTitle(response.data.task.title);
        setMember(response.data.task.member);
        setStatus(response.data.task.status);
        setGoal(response.data.task.goal);
        setDescription(response.data.task.description);
        setMessage("タスクを更新しました。");
      } else {
        const errorMessage = "Error: " + (response.data.error || "Unknown Error");
        setMessage(errorMessage);
      }
    } catch(error) {
      const errorMessage = "Error: " + (error.response?.data?.error || "Unknown Error");
      setMessage(errorMessage);
    }
  }

  const handleDelete = async(e) => {
    e.preventDefault();
    setDeleteMessage("削除中...");

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/tasks/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (response.data.success){
        router.push("/task/list");
      } else {
        const errorMessage = "Error: " + (response.data.error || "Unknown Error");
        setDeleteMessage(errorMessage);
      }

    } catch(error) {
      const errorMessage = "Error: " + (error.response?.data?.error || "Unknown Error");
      setDeleteMessage(errorMessage);
    }

  }

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
    },
    daily_reports: {
      margin: "1rem",
      padding: "1rem",
      border: "solid 1px #ccc",
      background: "rgba(255, 255, 255, 0.25)",
      borderRadius: "20px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(5px)",
      border: "1px solid rgba(255, 255, 255, 0.25)"
    },
    button: {
      position: "fixed",
      bottom: "3rem",
      right: "2rem"
    }
  };

  return (
    <Box p="xl">
      {task ? (
        <>
          <Center>
            <Box style={CSS.box}>
              <Flex align="center">
                <Heading size="xl" p="md">
                  {task.title}
                </Heading>
                <Spacer />
                <Heading size="md">
                  <Flex direction="column" p="md">
                    <Box>
                      Admin: {admin.name}
                    </Box>
                    <Box>
                      Member: {task.member}
                    </Box>
                  </Flex>
                </Heading>
              </Flex>
              <Divider />
              <Accordion isToggle>
                <AccordionItem label="タスク詳細" borderBottom="none">
                  {user ? (
                    user.id === admin.id ? (
                      <Tabs variant="rounded-solid" colorScheme="white">
                        <Tab>
                          ステータス
                        </Tab>
                        <Tab>
                          タスク編集
                        </Tab>
                        <Tab>
                          設定
                        </Tab>

                        <TabPanel>
                          <Flex p="md">
                            <Box p="md" width="20%">
                              タスクステータス:
                            </Box>
                            <Box p="md">
                              {task.status ? "進行中" : "終了済み"}
                            </Box>
                          </Flex>
                          {task.goal ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  目標:
                                </Box>
                                <Box p="md">
                                  {task.goal}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          {task.description ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  説明:
                                </Box>
                                <Box p="md">
                                  {task.description}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          <Divider />
                          <Flex p="md" align="center">
                                <Box p="md" width="20%">
                                  共有用URL:
                                </Box>
                                <Flex width="100%" align="center">
                                  <Input value={url} isReadOnly />
                                  <Button onClick={() => onCopy(url)} m="md">{hasCopied ? "Copied!" : "Copy"}</Button>
                                </Flex>
                          </Flex>

                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            <Heading size="md" p="md">
                              タスク編集
                            </Heading>
                            <Divider />
                            <form onSubmit={handleSubmit}>
                              <FormControl label="タイトル" p="md" isRequired>
                                <Input type="text" placeholder="タスク名を入力してください。" value={title} onChange={(e) => {setTitle(e.target.value)}} />
                              </FormControl>

                              <FormControl label="メンバー" p="md" isRequired>
                                <Input type="text" placeholder="メンバー名を入力してください。" value={member} onChange={(e) => {setMember(e.target.value)}} />
                              </FormControl>

                              <FormControl label="ステータス" p="md" isRequired>
                                <SegmentedControl defaultValue={status.toString()} onChange={(value) => {setStatus(value === "true")}}>
                                  <SegmentedControlButton value="true">進行中</SegmentedControlButton>
                                  <SegmentedControlButton value="false">終了済み</SegmentedControlButton>
                                </SegmentedControl>
                              </FormControl>

                              <FormControl label="タスクの目標" p="md">
                                <Textarea autosize minRows={3} placeholder="タスクの目標を入力してください。" value={goal} onChange={(e) => {setGoal(e.target.value)}} />
                              </FormControl>

                              <FormControl label="タスクの説明" p="md">
                                <Textarea autosize minRows={3} placeholder="タスクの説明を入力してください。" value={description} onChange={(e) => {setDescription(e.target.value)}} />
                              </FormControl>
                              <Divider p="md" />
                              <Center>
                                <Button type="submit" m="md">
                                  タスクを更新
                                </Button>
                              </Center>
                              <Center>
                                {message}
                              </Center>
                            </form>
                          </Box>
                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            <Heading size="md" p="md">
                              タスク削除
                            </Heading>
                            <Divider />
                            <Center>
                              <Button colorScheme="red" m="md" onClick={onOpen}>
                                タスクを削除
                              </Button>
                              <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                                <ModalHeader>
                                  タスクを削除しますか？
                                </ModalHeader>
                                <ModalBody>
                                  タスクを削除すると、元に戻すことはできません。<br />
                                  本当に削除しますか？

                                  <Center width="100%">
                                    <Box p="md" border="solid 1px" width="80%">
                                      <Flex p="md" direction="column">
                                        <Center p="md">
                                          <Heading size="md">
                                            削除されるタスク
                                          </Heading>
                                        </Center>
                                        <Divider />
                                        <Box p="md">
                                          <Center p="md">
                                            タスク名: {task.title}
                                          </Center>
                                          <Center p="md">
                                            メンバー: {task.member}
                                          </Center>
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </Center>
                                  <Center>
                                    {deleteMessage}
                                  </Center>         
                                </ModalBody>
                                <ModalFooter>
                                  <Center>
                                    <Button onClick={onClose}>
                                      とじる
                                    </Button>
                                  </Center>
                                  <Center>
                                    <Button colorScheme="red" m="md" onClick={handleDelete}>
                                      タスクを削除
                                    </Button>
                                  </Center>
                                </ModalFooter>
                              </Modal>
                            </Center>
                          </Box>
                        </TabPanel>
                      </Tabs>
                    ):(
                      <Tabs variant="rounded-solid" colorScheme="white">
                        <Tab>
                          ステータス
                        </Tab>
                        <Tab isDisabled>
                          タスク編集
                        </Tab>
                        <Tab isDisabled>
                          設定
                        </Tab>

                        <TabPanel>
                          <Flex p="md">
                            <Box p="md" width="20%">
                              タスクステータス:
                            </Box>
                            <Box p="md">
                              {task.status ? "進行中" : "終了済み"}
                            </Box>
                          </Flex>
                          {task.goal ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  目標:
                                </Box>
                                <Box p="md">
                                  {task.goal}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          {task.description ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  説明:
                                </Box>
                                <Box p="md">
                                  {task.description}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          <Divider />
                          <Flex p="md" align="center">
                                <Box p="md" width="20%">
                                  共有用URL:
                                </Box>
                                <Flex width="100%" align="center">
                                  <Input value={url} isReadOnly />
                                  <Button onClick={() => onCopy(url)} m="md">{hasCopied ? "Copied!" : "Copy"}</Button>
                                </Flex>
                          </Flex>

                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            管理者のみが閲覧可能です。
                          </Box>
                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            管理者のみが閲覧可能です。
                          </Box>
                        </TabPanel>
                      </Tabs>
                    )
                  ) : (
                    <Tabs variant="rounded-solid" colorScheme="white">
                        <Tab>
                          ステータス
                        </Tab>
                        <Tab isDisabled>
                          タスク編集
                        </Tab>
                        <Tab isDisabled>
                          設定
                        </Tab>

                        <TabPanel>
                          <Flex p="md">
                            <Box p="md" width="20%">
                              タスクステータス:
                            </Box>
                            <Box p="md">
                              {task.status ? "進行中" : "終了済み"}
                            </Box>
                          </Flex>
                          {task.goal ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  目標:
                                </Box>
                                <Box p="md">
                                  {task.goal}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          {task.description ? (
                            <>
                              <Divider />
                              <Flex p="md">
                                <Box p="md" width="20%">
                                  説明:
                                </Box>
                                <Box p="md">
                                  {task.description}
                                </Box>
                              </Flex>
                            </>      
                          ) : null}
                          <Divider />
                          <Flex p="md" align="center">
                                <Box p="md" width="20%">
                                  共有用URL:
                                </Box>
                                <Flex width="100%" align="center">
                                  <Input value={url} isReadOnly />
                                  <Button onClick={() => onCopy(url)} m="md">{hasCopied ? "Copied!" : "Copy"}</Button>
                                </Flex>
                          </Flex>

                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            管理者のみが閲覧可能です。
                          </Box>
                        </TabPanel>

                        <TabPanel>
                          <Box p="md">
                            管理者のみが閲覧可能です。
                          </Box>
                        </TabPanel>
                    </Tabs>
                  )}
                  
                  
                </AccordionItem>
              </Accordion>
            </Box>
          </Center>
          
          <Box p="xl">
            <Heading size="lg" p="md">
              進捗報告
            </Heading>
            <Divider />
            <Accordion p="md" isToggle defaultIndex={1}>
              <AccordionItem borderTop="none">
                <AccordionLabel>
                  <Heading size="xl">
                    未承認 - {unapprovedDailyReports.length}件
                  </Heading>
                </AccordionLabel>
                <AccordionPanel>
                  {unapprovedDailyReports.length == 0 ? (
                    <Heading size="md">
                      未承認の進捗報告はありません。
                    </Heading>
                  ) : (
                    unapprovedDailyReports.map((daily_report) => (
                      <Link key={daily_report.id} href={`/task/${id}/${daily_report.id}`}>
                        <Box key={daily_report.id} style={CSS.daily_reports} p="md">
                          <Flex style={CSS.flex}>
                            <Heading size="md" p="md">
                              進捗報告概要:{daily_report.date}
                            </Heading>
                            <Spacer />
                            <Box p="md">
                              {task.member}さん
                            </Box>
                          </Flex>
                          <Divider />
                          <Box p="md">
                            {daily_report.summary}
                          </Box>
                          {daily_report.approved ? (
                            <Box p="md">
                              <Flex direction="center">
                                <Box>
                                  承認済み
                                </Box>
                                <Box>
                                  コメント数
                                </Box>
                              </Flex>
                            </Box>
                          ) : (
                            <Box p="md">
                              <Flex direction="column">
                                <Box>
                                  未承認
                                </Box>
                                <Box>
                                  コメント数:{daily_report.comments.length}
                                </Box>
                              </Flex>
                            </Box>
                          )}
                        </Box>
                      </Link>
                    )
                    )
                  )}
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem borderBottom="none">
                <AccordionLabel>
                  <Heading size="xl">
                    承認済み - {approvedDailyReports.length}件
                  </Heading>
                </AccordionLabel>
                <AccordionPanel>
                  {approvedDailyReports.length == 0 ? (
                    <Heading size="md">
                      承認済みの進捗報告はありません。
                    </Heading>
                  ) : (
                    approvedDailyReports.map((daily_report) => (
                      <Link key={daily_report.id} href={`/task/${id}/${daily_report.id}`}>
                        <Box key={daily_report.id} style={CSS.daily_reports} p="md">
                          <Flex style={CSS.flex}>
                            <Heading size="md" p="md">
                              進捗報告概要:{daily_report.date}
                            </Heading>
                            <Spacer />
                            <Box p="md">
                              {task.member}さん
                            </Box>
                          </Flex>
                          <Divider />
                          <Box p="md">
                            {daily_report.summary}
                          </Box>
                          {daily_report.approved ? (
                            <Box p="md">
                              <Flex direction="column">
                                <Box>
                                  承認済み
                                </Box>
                                <Box>
                                  コメント数:{daily_report.comments.length}
                                </Box>
                              </Flex>
                            </Box>
                          ) : (
                            <Box p="md">
                              <Flex direction="column">
                                <Box>
                                  未承認
                                </Box>
                                <Box>
                                  コメント数
                                </Box>
                              </Flex>
                            </Box>
                          )}
                        </Box>
                      </Link>
                    )
                    )
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
          
          

          { user ?(
            user.id === admin.id ? (
              null
            ) : (
              <Link href={`/task/${id}/create`}>
                <Button colorScheme="primary" style={CSS.button} rightIcon={<ArrowRight />} size="md">
                  タスクを作成
                </Button>
              </Link>
            )
          ):(
            <Link href={`/task/${id}/create`}>
              <Button colorScheme="primary" style={CSS.button} rightIcon={<ArrowRight />} size="md">
                タスクを作成
              </Button>
            </Link>
          )}
          
        </>
      ) : (
        null
      )}
    </Box>
  );
}