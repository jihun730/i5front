import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  Table,
  Thead,
  Tbody,
  Td,
  Th,
  Tr,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";

// Card 컴포넌트를 추가
import Card from "components/card/Card"; // 실제 경로에 맞게 수정해야 합니다.

export default function ChatTable() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const tableRef = useRef(null);
  const inputRef = useRef(null);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMessages = [...messages, { text: newMessage }];
    setMessages(newMessages);
    setNewMessage("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // 페이지가 로드될 때 입력 칸에 포커스를 설정
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleTabKeyPress = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      inputRef.current.focus();
    }
  };

  return (
    <Card
      direction="column"
      w="100%"
      p="0" // 패딩을 0으로 설정하여 내용을 조절
      overflow="hidden" // 내용이 넘치면 스크롤바 표시
      maxHeight="400px"
      position="relative" // 상대 위치 지정
    >
      <div
        style={{
          position: "sticky",
          top: "0",
          background: "white",
          padding: "20px",
          zIndex: "1", // 다른 내용 위에 레이어 표시
          borderBottom: "1px solid #e2e8f0", // 구분선 추가
        }}
      >
        {/* 메시지 입력란과 보내기 버튼 */}
        <Flex>
          <Input
            ref={inputRef} // ref를 설정하여 포커스를 받을 수 있게 함
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress} // 엔터 키를 감지
            onKeyDown={handleTabKeyPress} // 탭 키를 감지하여 포커스 설정
            placeholder="메시지를 입력하세요..."
            flex="1"
          />
          <Button
            onClick={sendMessage}
            bgColor="teal.400"
            color="white"
            ml="10px"
          >
            보내기
          </Button>
        </Flex>
      </div>
      <div
        style={{
          overflowY: "scroll",
          height: "100%", // 스크롤 영역을 최대 높이로 설정
        }}
        ref={tableRef}
      >
        <Table variant="simple" color="gray.500">
          <Tbody>
            {messages.map((message, index) => (
              <Tr key={index}>
                <Td>{message.text}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </Card>
  );
}
