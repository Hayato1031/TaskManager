import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { Accordion, AccordionItem, Box, Button, Center, Divider, Flex, FormControl, Heading, Input, useDisclosure, Modal, ModalHeader, ModalBody, ModalFooter } from "@yamada-ui/react";

export default function Profile() {
    const { user, isLoggedIn, token, setUser, logout } = useAuth();
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [deleteMessage, setDeleteMessage] = useState("");

    const router = useRouter();

    const { isOpen, onOpen, onClose } = useDisclosure()


    useEffect(() => {
        if (user) {
            setName(user.name);
        } 
    }, [user]);

    const handleNameChange = async (e) => {
        e.preventDefault();
        try {
            if (!token) {
                setMessage("認証トークンが見つかりません。ログインし直してください。");
                return;
            }
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/update_username`, {
                user: {
                    name: name
                }
            },{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true
            });
    
            if (response.data.success){
                setMessage("ユーザー名を変更しました。");
                const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/validate_token`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                console.log("User response:", userResponse.data); // デバッグ情報を追加
                setUser(userResponse.data.user);
            } else {
                console.error("Error Response:", response.data); // 詳細なエラーメッセージをコンソールに出力
                const errorMessage = response.data.error || "Unknown Error";
                setMessage("Error: " + errorMessage);
            }
    
        } catch (error) {
            console.error("Error details:", error.response?.data); // エラーの詳細をコンソールに出力
            const errorMessage = error.response?.data?.error || "Unknown Error";
            setMessage("Error: " + errorMessage);
        }
    }

    const handleDelete = async(e) => {
        e.preventDefault();
        setDeleteMessage("削除中...");
    
        try {
          const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/destroy`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true
          });
    
          if (response.data.success){
            logout();
            router.push("/");
            alert("アカウントが削除されました。");
          } else {
            const errorMessage = "Error: " + (response.data.error || "Unknown Error");
            setDeleteMessage(errorMessage);
          }
    
        } catch(error) {
          const errorMessage = "Error: " + (error.response?.data?.error || "Unknown Error!");
          setDeleteMessage(errorMessage);
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
            width: "100%",
        },
        setting: {
            width: "80%"
        }
    }

    return (
        <Center p="xl">
            {isLoggedIn ? (
                <Flex direction="column" style={CSS.flex}>
                    <Center>
                        <Box p="md" style={CSS.box}>
                            <Heading size="xl" p="md">プロフィール</Heading>
                            <Divider />
                            <Box p="md">
                                <Box>
                                    <Box m="md">
                                        <Heading size="md">ユーザー名: {user.name}</Heading>
                                        <Heading size="md">メールアドレス: {user.email}</Heading>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Center>

                    <Center>
                        <Box p="md" style={CSS.setting}>
                            <Heading size="xl" p="md">アカウント設定</Heading>
                            <Accordion p="md" isMultiple>
                                <AccordionItem label="ユーザー名の変更">
                                    <Center>
                                        <Box p="md" style={CSS.box}>
                                            <Heading size="md" p="md">
                                                ユーザー名変更
                                            </Heading>
                                            <Divider />
                                            <Box p="md">
                                                <form onSubmit={handleNameChange}>
                                                    <FormControl label="変更後のユーザー名" isRequired>
                                                        <Input type="name" placeholder="変更したいユーザー名を入力" value={name}  onChange={(e) => {setName(e.target.value)}}/>
                                                        <Center>
                                                            <Button m="md" variant="outline" colorScheme="cyan" type="submit">
                                                                名前を変更
                                                            </Button>
                                                        </Center>  
                                                    </FormControl>
                                                </form>
                                            </Box>
                                            <Center>
                                                {message}
                                            </Center>
                                        </Box>
                                    </Center>        
                                </AccordionItem>
                                <AccordionItem label="メールアドレス変更">
                                    メールアドレス変更フォーム
                                    <Link href="/account/change_email">
                                        <Button variant="ghost" colorScheme="cyan">
                                            メールアドレスを変更
                                        </Button>
                                    </Link>
                                </AccordionItem>
                                <AccordionItem label="パスワード変更">
                                    パスワード変更フォーム
                                    <Link href="/account/change_password">
                                        <Button variant="ghost" colorScheme="cyan">
                                            パスワードを変更
                                        </Button>
                                    </Link>
                                </AccordionItem>
                                <AccordionItem label="アカウント削除">
                                    アカウント削除
                                    <Button onClick={onOpen} variant="ghost" colorScheme="red">
                                        アカウント削除
                                    </Button>
                                    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
                                        <ModalHeader>
                                            アカウントを削除しますか？
                                        </ModalHeader>
                                        <ModalBody>
                                        アカウントを削除すると、元に戻すことはできません。<br />
                                        本当に削除しますか？

                                        <Center width="100%">
                                            <Box p="md" border="solid 1px" width="80%">
                                                <Flex p="md" direction="column">
                                                    <Center p="md">
                                                        <Heading size="md">
                                                            削除されるアカウント
                                                        </Heading>
                                                    </Center>
                                                    <Divider />
                                                    <Box p="md">
                                                        <Center p="md">
                                                        アカウント名: {user.name}
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
                                                アカウントを削除
                                            </Button>
                                        </Center>
                                    </ModalFooter>
                                    </Modal>
                                </AccordionItem>
                            </Accordion>
                        </Box>
                    </Center>
                </Flex>
                        
            ) : (
                <Box p="md" style={CSS.box}>
                    <Heading size="xl" p="md">プロフィール</Heading>
                    <Divider />
                    <Box p="md">
                        <Box>
                            <Box m="md">
                                <Heading size="md">ログインしてください</Heading>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Center>
    );
}