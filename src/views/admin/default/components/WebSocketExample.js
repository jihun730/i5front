import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import Camoff from "assets/img/dashboards/camoff.png";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function TotalSpent(props) {
  const { ...rest } = props;
  const [fetchImage, setFetchImage] = useState(true);
  const [data, setData] = useState({
    qr_data: "",
    qr_image: "",
    label: "",
  });
  const [cameraOn, setCameraOn] = useState(true); // 카메라 상태를 저장할 상태 변수

  const toggleFetchImage = () => {
    setFetchImage((prevState) => !prevState);
    // "off" 메시지를 서버로 전송하여 카메라를 끄도록 요청
    if (cameraOn) {
      stompClient.send("/app/cameraControl", {}, JSON.stringify({ command: "off" }));
    }
  };

  useEffect(() => {
    let stompClient; // stompClient를 이 useEffect 내부에서 선언

    const fetchData = async () => {
      if (fetchImage) {
        try {
          const response = await axios.get("http://10.10.10.111:5000/stream");
          setData(response.data);
        } catch (error) {
          console.error("데이터 가져오기 오류:", error);
        }
      }
    };

    const connectWebSocket = () => {
      const socket = new SockJS("http://10.10.10.111:8080/your-sockjs-endpoint"); // WebSocket 연결 설정
      stompClient = Stomp.over(socket);
      stompClient.connect({}, () => {
        console.log("WebSocket에 연결됨");
        stompClient.subscribe("/topic/cameraStatus", (message) => {
          // "off" 또는 "on" 메시지를 수신하면 카메라 상태를 업데이트
          const command = JSON.parse(message.body).command;
          setCameraOn(command === "on");
        });
      });
    };

    connectWebSocket(); // WebSocket 연결 함수 호출

    const intervalId = setInterval(fetchData, 33);

    return () => {
      clearInterval(intervalId);
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [fetchImage]);

  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          AICamera
        </Text>
      </Flex>
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <div className="TotalSpent">
            {cameraOn ? (
              <img
                src={"data:image/jpeg;base64," + data.qr_image}
                alt="비디오 스트림"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <img
                src={Camoff}
                alt="카메라 꺼짐"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" me="20px" mt="28px">
          <Flex align="center" mb="20px">
            <Button
              backgroundColor="brand.500"
              color="white"
              fontSize="sm"
              fontWeight="500"
              mt="4px"
              mr="12px"
              _hover={{ backgroundColor: "brand.600" }}
              onClick={toggleFetchImage}
            >
              {fetchImage ? "카메라 중지" : "카메라 시작"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
