/* import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import RobotArm from "assets/img/dashboards/robotArm.gif"
import Rail from "assets/img/dashboards/rail.gif"
import StopRail1 from "assets/img/dashboards/stopArm1.png"
import StopRail2 from "assets/img/dashboards/stopArm2.png"

export default function TotalSpent(props) {
  const { productCount, productCountB, defectiveCount, ...rest } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [cameraColor, setCameraColor] = useState("teal"); // 초기 색상을 teal로 설정
  const [currentImage, setCurrentImage] = useState(StopRail1);

  useEffect(() => {
    if (productCount > 0) {
      // 상품 개수가 1 이상일 때 초록색으로 설정
      setCameraColor("green");

      // 1초 후에 다시 teal(기본)로 설정
      setTimeout(() => {
        setCameraColor("teal");
      }, 500); // 1000밀리초 (1초)
    }
  }, [productCount]);

  useEffect(() => {
    if (productCountB > 0) {
      // 상품 개수가 1 이상일 때 초록색으로 설정
      setCameraColor("green");

      // 1초 후에 다시 teal(기본)로 설정
      setTimeout(() => {
        setCameraColor("teal");
      }, 500); // 1000밀리초 (1초)
    }
  }, [productCountB]);

  useEffect(() => {
    if (defectiveCount > 0) {
      // 불량품 개수가 1 이상일 때 빨간색으로 설정
      setCameraColor("red");

      // 1초 후에 다시 teal(기본)로 설정
      setTimeout(() => {
        setCameraColor("teal");
      }, 500); // 1000밀리초 (1초)
    }
  }, [defectiveCount]);

  // 카메라 버튼 클릭 시 실행할 함수
  const handleCameraButtonClick = () => {
    // 이 곳에 카메라 버튼 클릭 시 실행할 로직을 추가하세요.
    console.log("카메라 버튼을 클릭했습니다.");
    // 여기에서 원하는 동작을 수행합니다.
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentImage(RobotArm);
    }, 1000); // 1초 후에 RobotArm 이미지로 변경

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (currentImage === RobotArm) {
      const timeout = setTimeout(() => {
        setCurrentImage(StopRail2);
      }, 9700); // 1초 후에 StopRail2 이미지로 변경

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentImage]);

  useEffect(() => {
    if (currentImage === StopRail2) {
      const timeout = setTimeout(() => {
        setCurrentImage(Rail);
      }, 1000); // 1초 후에 Rail 이미지로 변경

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentImage]);

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
          장비 모니터링
        </Text>
      </Flex>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Button
          colorScheme={cameraColor} // 상태에 따라 변경된 색상을 사용
          onClick={() => {
            if (cameraColor === "teal") {
              // 초록색일 때만 동작
              handleCameraButtonClick();
            }
          }}
          isDisabled={cameraColor === "teal"} // 초록색일 때만 클릭 가능
        >
          카메라
        </Button>
      </Flex>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Image src={currentImage} alt="Current Image" />
      </Flex>
    </Card>
  );
}
 */

import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import RobotArm from "assets/img/dashboards/robotArm.gif";
import StopRail1 from "assets/img/dashboards/stopArm1.png";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export default function TotalSpent(props) {
  const { ...rest } = props;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [cameraColor, setCameraColor] = useState("teal");
  const [currentImage, setCurrentImage] = useState(StopRail1);

  useEffect(() => {
    // SockJS 서버 주소를 지정하여 연결 생성
    const socket = new SockJS('http://10.10.10.111:8080/your-sockjs-endpoint'); // 실제 SockJS 엔드포인트로 변경

    const stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
      console.log('WebSocket 연결 성공!');
      // 메시지 수신 이벤트 핸들러
      stompClient.subscribe('/topic/receive', message => {
        const receivedMessage = message.body;
        if (receivedMessage === 'on') {
          setCurrentImage(RobotArm);
        } else if (receivedMessage === 'off') {
          setCurrentImage(StopRail1);
        }
      });
    });

    stompClient.onDisconnect = () => {
      console.log('WebSocket 연결 종료');
    };

    return () => {
      // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
      stompClient.disconnect();
    };
  }, []);

  // 카메라 버튼 클릭 시 실행할 함수
  const handleCameraButtonClick = () => {
    // 이 곳에 카메라 버튼 클릭 시 실행할 로직을 추가하세요.
    console.log("카메라 버튼을 클릭했습니다.");
    // 여기에서 원하는 동작을 수행합니다.
  };

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
          장비 모니터링
        </Text>
      </Flex>
      <Flex align="center" w="100%" px="15px" py="10px">
{/*         <Button
          colorScheme={cameraColor}
          onClick={() => {
            if (cameraColor === "teal") {
              // 초록색일 때만 동작
              handleCameraButtonClick();
            }
          }}
          isDisabled={cameraColor === "teal"}
        >
          카메라
        </Button> */}
      </Flex>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Image src={currentImage} alt="Current Image" />
      </Flex>
    </Card>
  );
}

