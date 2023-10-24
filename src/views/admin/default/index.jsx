import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Text,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
} from "@chakra-ui/react";
import { MdAttachMoney } from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import TotalSpent from './components/TotalSpent';
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import { Fragment } from "react";
import Charts from "./charts";
import WebSocket from './components/WebSocket';


import { pieChartData, pieChartOptions } from "views/admin/default/charts";
import { columnsDataCheck, columnsDataComplex } from "views/admin/default/variables/columnsData";
import tableDataCheck from "views/admin/default/variables/tableDataCheck.json";
import tableDataComplex from "views/admin/default/variables/tableDataComplex.json";
import failImage from "assets/img/dashboards/fail.png";
import repairImg from "assets/img/dashboards/repair.png";
import percentImg from "assets/img/dashboards/percent.png";
import { Chart } from 'react-chartjs-2';
import axios from 'axios';
import { totalResult } from '../default/components/CheckTable';

export default function UserReports() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [isOn, setIsOn] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [productCountB, setProductCountB] = useState(0);
  const [defectiveCount, setDefectiveCount] = useState(0);
  const [defectiveBoxCheckCount, setDefectiveBoxCheckCount] = useState(0);
  const [defectiveBoxes, setDefectiveBoxes] = useState([]);
  const [blink, setBlink] = useState(false);
  const [chartData, setChartData] = useState(pieChartData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const kei = productCount + productCountB;
  const toggleButton = () => {
    setIsOn(!isOn);
  };

  const buttonStyle = {
    backgroundColor: isOn ? 'green' : 'red',
    color: 'white',
    fontSize: 'sm',
    fontWeight: '500',
    mt: '4px',
    mr: '12px',
    _hover: { backgroundColor: isOn ? 'green.600' : 'red.600' },
  };

  const [tableDataCheck, setTableDataCheck] = useState([]);
  const fetchData = async () => {
    try {
      const response = await axios.get("http://10.10.10.111:8080/product/");
      setTableDataCheck(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProductRecognition = () => {
    setProductCount(productCount + 1);
    setBlink(true);
  };

  const handleProductRecognitionB = () => {
    setProductCountB(productCountB + 1);
    setBlink(true);
  };

  const data = [
    {
      name: 'A박스개수',
      value: productCount,
      icon: failImage,
    },
    {
      name: 'B박스개수',
      value: productCountB,
      icon: failImage,
    },
  ];

  

  const handleDefectiveRecognition = () => {
    setDefectiveCount(defectiveCount + 1);
    setDefectiveBoxCheckCount(defectiveBoxCheckCount + 1);
    setDefectiveBoxes((prevDefectiveBoxes) => [...prevDefectiveBoxes, defectiveCount + 1]);
  };

  const handleFixingDefect = (boxNumber) => {
    setDefectiveBoxes((prevDefectiveBoxes) =>
      prevDefectiveBoxes.filter((box) => box !== boxNumber)
    );
    if (defectiveBoxCheckCount > 0) {
      setDefectiveBoxCheckCount(defectiveBoxCheckCount - 1);
    }
  };

  const defectiveRatio = (defectiveCount / (productCount+productCountB)) * 100;

  useEffect(() => {
    if (defectiveCount >= 1) {
      const interval = setInterval(() => {
        setBlink((prevBlink) => !prevBlink);
      }, 500);

      return () => clearInterval(interval);
    } else {
      setBlink(false);
    }
  }, [defectiveCount]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const total = productCount + defectiveCount;
    const normalRatio = (productCount / total) * 100;
    const defectiveRatio = (defectiveCount / total) * 100;
    const updatedChartData = [normalRatio, defectiveRatio];

    setChartData(updatedChartData);
  }, [productCount, defectiveCount]);

  // useEffect(() => {
  //   const total = productCount1 + defectiveCount;
  //   const normalRatio = (productCount1 / total) * 100;
  //   const defectiveRatio = (defectiveCount / total) * 100;
  //   const updatedChartData = [normalRatio, defectiveRatio];

  //   setChartData(updatedChartData);
  // }, [productCount1, defectiveCount]);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
        gap='20px'
        mb='20px'
      >
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Total Price'
          value={totalResult}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <img src={failImage} alt="Fail" width="32px" height="32px" style={{ transform: 'rotate(180deg) scaleX(-1)'}} />
              }
            />
          }
          name='A박스개수'
          value={productCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <img src={failImage} alt="Fail" width="32px" height="32px" style={{ transform: 'rotate(180deg) scaleX(-1)'}} />
              }
            />
          }
          name='B박스개수'
          value={productCountB}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <img src={failImage} alt="Fail" width="32px" height="32px" />
              }
            />
          }
          name='불량품 개수'
          value={defectiveCount}
        />
        <MiniStatistics
          startContent={
            <Tooltip label="불량품 검사" fontSize="sm">
              <Button
                onClick={openModal}
                w='56px'
                h='56px'
                bg={(defectiveBoxCheckCount === 0) ? boxBg : (blink ? 'red' : boxBg)}
                color={(defectiveBoxCheckCount === 0) ? 'black' : ((defectiveCount >= 1 && blink) ? 'white' : 'black')}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                borderRadius="full"
              >
                <img src={repairImg} alt="Fail" width="32px" height="32px" />
              </Button>
            </Tooltip>
          }
          name='박스 불량 체크'
          value={defectiveBoxCheckCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <img src={percentImg} alt="Fail" width="32px" height="32px" />
              }
            />
          }
          name='불량품 비율'
          value={`${defectiveRatio.toFixed(2)}%`}
        />
      </SimpleGrid>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>불량품 검사</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr auto" gap={2}>
              {defectiveBoxes.map((boxNumber) => (
                <Fragment key={boxNumber}>
                  <Box>
                    불량품 박스 {boxNumber}
                  </Box>
                  <Button
                    onClick={() => handleFixingDefect(boxNumber)}
                    colorScheme="teal"
                    variant="solid"
                    size="sm"
                  >
                    해결
                  </Button>
                </Fragment>
              ))}
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeModal}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent
          productCount={productCount}
          defectiveCount={defectiveCount}
        />
        <WeeklyRevenue />
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
        <ComplexTable 
        columnsData={columnsDataComplex} 
        tableData={tableDataComplex} 
        productCount={productCount} 
        defectiveCount={defectiveCount}
        productCountB={productCountB}
        />
          <PieCard>
            <Chart productCount = {productCount}
            productCountB = {productCountB}/>
          </PieCard>
        </SimpleGrid>
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
        
          <Button onClick={handleProductRecognition}>A박스 개수 +1</Button>
          <Button onClick={handleProductRecognitionB}>B박스 개수 +1</Button>
          <Button onClick={handleDefectiveRecognition}>불량품 개수 +1</Button>
          <WebSocket></WebSocket>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
    
  );
}
