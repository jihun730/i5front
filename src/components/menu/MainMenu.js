import { useState } from "react";

// Chakra imports
import {
  Icon,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import {
  MdOutlineMoreHoriz,
  MdOutlinePerson,
  MdOutlineCardTravel,
  MdOutlineLightbulb,
  MdOutlineSettings,
} from "react-icons/md";

export default function Banner(props) {
  const { ...rest } = props;

  const textColor = useColorModeValue("secondaryGray.500", "white");
  const textHover = useColorModeValue(
    { color: "secondaryGray.900", bg: "unset" },
    { color: "secondaryGray.500", bg: "unset" }
  );
  const iconColor = useColorModeValue("brand.500", "white");
  const bgList = useColorModeValue("white", "whiteAlpha.100");
  const bgShadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );

  // Ellipsis modals
  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProductName, setEditedProductName] = useState(""); // 수정된 상품 이름
  const [editedProductPrice, setEditedProductPrice] = useState(""); // 수정된 상품 가격
  const [editedProductDescription, setEditedProductDescription] = useState(""); // 수정된 상품 설명
  const handleDeleteProduct = () => {
    // 여기에서 상품을 삭제하는 API 호출 또는 상태 업데이트 등의 로직을 구현하세요.
    // 삭제 완료 후 모달을 닫을 수 있습니다.
    setIsEditModalOpen(false);
  };
  
  
  return (
    <Menu isOpen={isOpen1} onClose={onClose1}>
      <MenuButton
        align='center'
        justifyContent='center'
        bg={bgButton}
        _hover={bgHover}
        _focus={bgFocus}
        _active={bgFocus}
        w='37px'
        h='37px'
        lineHeight='100%'
        onClick={onOpen1}
        borderRadius='10px'
        {...rest}>
        <Icon as={MdOutlineMoreHoriz} color={iconColor} w='24px' h='24px' />
      </MenuButton>
      <MenuList
        w='150px'
        minW='unset'
        maxW='150px !important'
        border='transparent'
        backdropFilter='blur(63px)'
        bg={bgList}
        boxShadow={bgShadow}
        borderRadius='20px'
        p='15px'>
        <MenuItem
          transition="0.2s linear"
          color={textColor}
          _hover={textHover}
          p="0px"
          borderRadius="8px"
          _active={{
            bg: "transparent",
          }}
          _focus={{
            bg: "transparent",
          }}
          mb="10px"
          onClick={() => {
            // 수정 모달 열기
            setIsEditModalOpen(true);
            // 상품 정보를 모달에 채우기 (예: 이름, 가격, 설명)
            setEditedProductName(/* 현재 상품 이름 */);
            setEditedProductPrice(/* 현재 상품 가격 */);
            setEditedProductDescription(/* 현재 상품 설명 */);
          }}
        >
          <Flex align="center">
            <Icon as={MdOutlinePerson} h="16px" w="16px" me="8px" />
            <Text fontSize="sm" fontWeight="400">
              수정
            </Text>
          </Flex>
        </MenuItem>
        <MenuItem
          transition='0.2s linear'
          p='0px'
          borderRadius='8px'
          color={textColor}
          _hover={textHover}
          _active={{
            bg: "transparent",
          }}
          _focus={{
            bg: "transparent",
          }}
          mb='10px'>
          <Flex align='center'>
            <Icon as={MdOutlineCardTravel} h='16px' w='16px' me='8px' />
            <Text fontSize='sm' fontWeight='400'>
              삭제
            </Text>
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
