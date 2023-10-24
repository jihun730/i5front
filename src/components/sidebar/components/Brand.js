import React from "react";
import { Flex, useColorModeValue, Text } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  let specialColor = "Blue"; // 원하는 특별한 색상을 지정하세요

  return (
    <Flex align="center" direction="column">
      {/* "I5" 텍스트 */}
      <Text
        fontSize="24px"
        fontWeight="bold"
        color={logoColor}
        marginTop="32px"
      >
        I<span style={{ color: specialColor }}>5</span>
      </Text>

      {/* "Brillient Star" 텍스트 */}
      <Text
        fontSize="24px"
        fontWeight="bold"
        color={logoColor}
        marginTop="4px" // 필요에 따라 조절하세요
      >
        Brillient Star
      </Text>

      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
