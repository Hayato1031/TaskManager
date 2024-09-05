import Image from "next/image";
import { Center, Box, Container, Divider, Heading } from "@yamada-ui/react";
import { Carousel, CarouselSlide } from "@yamada-ui/carousel";

export default function Home() {
  const CSS = {
    box: {
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
      <Carousel p="xl">
        <CarouselSlide as={Center} bg="primary">
          <Heading color="white">
            タスクの進捗を1:1で管理
          </Heading>
        </CarouselSlide>
        <CarouselSlide as={Center} bg="secondary">
          2
        </CarouselSlide>
        <CarouselSlide as={Center} bg="warning">
          3
        </CarouselSlide>
        <CarouselSlide as={Center} bg="danger">
          4
        </CarouselSlide>
      </Carousel>

      <Center m="md">
        <Box p="1rem" style={CSS.box}>
          <Container>
            <Heading>
              About
            </Heading>
            <Divider />
            <Box>
              このサイトはタスクの進捗を1:1で管理するためのサイトです。<br />
              タスクの管理者がタスクを作成し、担当者に割り当てることができます。<br />
              担当者はタスクの進捗を管理者に報告することができます。<br />
              また、管理者はタスクの進捗を確認し、コメントを返すことで承認が可能です。<br />
            </Box>
          </Container>
          <Container>
            <Heading>
              How to use
            </Heading>
            <Divider />
            <Box>
              工事中...
            </Box>
          </Container>
        </Box>
      </Center>
    </>
  );
}
