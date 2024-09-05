import { Button, Box, Center, Divider, Heading, FormControl, Input, Label, HelperMessage, ErrorMessage, Flex, Spacer} from "@yamada-ui/react";
import Link from "next/link";

export default function Signup() {
    const CSS = {
        form:{
            width: "80%",
            border: "solid 1px #ccc",
            background: "rgba(255, 255, 255, 0.25)",
            borderRadius: "20px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.25)"
        }
    }

    return (
        <>
            <Center p="xl">
                <Box as="form" m="md" p="md" rounded="md" style={CSS.form}>
                    <Flex p="md">
                        <Heading size="md">新規登録</Heading>
                        <Spacer />
                        <Button variant="link" colorScheme="cyan">
                            <Link href="/account/login">
                                ログインはこちら
                            </Link>
                        </Button>
                    </Flex>
                    <Divider />
                    <Box p="md">
                        <FormControl  isRequired label="メールアドレス" p="md">
                            <Input type="email" placeholder="メールアドレスを入力" />
                        </FormControl>

                        <FormControl  isRequired label="ユーザー名" p="md">
                            <Input type="name" placeholder="ユーザー名を入力" />
                        </FormControl>

                        <FormControl  isRequired label="パスワード" p="md">
                            <Input type="password" placeholder="パスワードを入力" />
                        </FormControl>

                        <FormControl  isRequired label="確認用パスワード" p="md">
                            <Input type="password" placeholder="パスワードをもう一度入力" />
                        </FormControl>
                    </Box>
                    <Divider />
                    <Center p="md">
                        <Button variant="outline" colorScheme="cyan">
                            新規登録
                        </Button>
                    </Center>
                </Box>
            </Center>
        </>
    );
}