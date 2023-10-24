import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Camoff from "assets/img/dashboards/camoff.png"

export default function TotalSpent(props) {
  const { ...rest } = props;
  const [fetchImage, setFetchImage] = useState(true);
  const [data, setData] = useState({
    qr_data: "",
    qr_image: "",
    label: "",
  });

  const toggleFetchImage = () => {
    setFetchImage((prevState) => !prevState);
  };

  // WebSocket 연결 설정
  useEffect(() => {
    const socket = new SockJS('http://10.10.10.111:8080/your-sockjs-endpoint'); // 실제 SockJS 엔드포인트로 변경
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log('WebSocket 연결 성공!');
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  // WebSocket을 통해 메시지 보내는 함수
  const sendMessage = (message) => {
    const socket = new SockJS('http://10.10.10.111:8080/your-sockjs-endpoint'); // 실제 SockJS 엔드포인트로 변경
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      stompClient.send('/app/IotControl', {}, message);
      console.log(`메시지 보냄: ${message}`);
    });
  };

  const handleCameraOff = () => {
    sendMessage('off'); // "cameraoff" 메시지 보내기
    setFetchImage(false); // fetchImage 비활성화
  };

  const handleCameraOn = () => {
    sendMessage('on'); // "cameraon" 메시지 보내기
    setFetchImage(true); // fetchImage 활성화
  };

  // 이미지 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (fetchImage) {
        try {
          const response = await axios.get("http://10.10.10.111:5000/stream");
          setData(response.data);
        } catch (error) {
          console.error("데이터 가져오기 오류:", error);
        }
      } else {
        setData({
          qr_data: "",
          qr_image: "", // 빈 문자열 또는 null로 설정
          label: "",
        });
      }
    };

    const intervalId = setInterval(fetchData, 33);

    return () => {
      clearInterval(intervalId);
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
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
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
          <Button
               backgroundColor="brand.500"
               color="white"
               fontSize="sm"
               fontWeight="100"
               mt="4px"
               mb="20px" // 여기에서 버튼과 하단 간격을 조절할 수 있습니다.
               _hover={{ backgroundColor: "brand.600" }}
               onClick={fetchImage ? handleCameraOff : handleCameraOn}
               size="md"
             >
              {fetchImage ? "OFF" : "ON"}
            </Button>
      </Flex>
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <div className="TotalSpent">
            {fetchImage==true && data.qr_image ? (
              <img
              src={"data:image/jpeg;base64," + data.qr_image}
              alt="Video Stream"
              style={{
                maxHeight: "430px", // camoff.png 이미지의 높이와 동일하게 설정
                width: "auto", // 가로 너비는 자동으로 조정
                display: "block",
                margin: "0 auto",
              }}
            />
            ) : (
              // "off" 상태일 때 Camoff 이미지를 표시
              <img
                src={Camoff}
                alt="Camera Off"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            )}
          </div>
        </Flex>
      </Flex>
      <Flex w="100%" flexDirection={{ base: "column", lg: "row" }}>
        <Flex flexDirection="column" me="20px" mt="28px">
          <Flex align="center" mb="20px">
            
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
