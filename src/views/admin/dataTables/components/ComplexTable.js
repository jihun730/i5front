import React, { useMemo, useState, useEffect } from "react";
import {
  Flex,
  Table,
  Progress,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  useColorModeValue,
  Tbody,
  Button,
} from "@chakra-ui/react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";

export default function WarehouseTable({ productCount, productCountB, defectiveCount }) {
  const columnsData = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Progress",
        accessor: "progress",
      },
      {
        Header: "ADMIN",
        accessor: "admin",
      },
    ],
    []
  );

  const [tableData, setTableData] = useState([
    {
      name: "A창고",
      progress: (productCount / 10) * 100,
    },
    {
      name: "B창고",
      progress: (productCountB / 10) * 100,
    },
    {
      name: "불량품창고",
      progress: (defectiveCount / 10) * 100,
    },
  ]);

  const [productCount1, setProductCount1] = useState(0);
  useEffect(()=>{
    setProductCount1(0)
  }, [])
  useEffect(() => {
    // productCount가 변경될 때마다 A창고의 바 업데이트
    
    setProductCount1(productCount1+1);
    setTableData((prevData) => {
      const newData = [
        ...prevData.map((item) =>
          item.name === "A창고"
            ? { ...item, progress: (productCount1 / 10) * 100 }
            : item
        ),
      ];
      return newData;
    });
  }, [productCount]);

  const [productCountB1, setProductCountB1] = useState(0);
  useEffect(()=>{
    setProductCountB1(0)
  }, [])


  useEffect(() => {
    // productCount가 변경될 때마다 B창고의 바 업데이트
    
    setProductCountB1(productCountB1+1);
    setTableData((prevData) => {
      const newData = [
        ...prevData.map((item) =>
          item.name === "B창고"
            ? { ...item, progress: (productCountB1 / 10) * 100 }
            : item
        ),
      ];
      return newData;
    });
  }, [productCountB]);

  const [defectiveCount1, setdefectiveCount1] = useState(0);
  useEffect(()=>{
    setdefectiveCount1(0)
  }, [])


  useEffect(() => {
    // productCount가 변경될 때마다 B창고의 바 업데이트
    
    setdefectiveCount1(defectiveCount1+1);
    setTableData((prevData) => {
      const newData = [
        ...prevData.map((item) =>
          item.name === "불량품창고"
            ? { ...item, progress: (defectiveCount1 / 10) * 100 }
            : item
        ),
      ];
      return newData;
    });
  }, [defectiveCount]);

  const columns = useMemo(() => columnsData, [columnsData]);

  const clearWarehouse = (warehouseName) => {
    // 창고를 비우는 핸들러 함수 정의
    setProductCount1(1)
    setProductCountB1(1)
    setdefectiveCount1(1)
    setTableData((prevData) => {
      const newData = prevData.map((item) => {
        if (item.name === warehouseName) {
          return {
            ...item,
            progress: 0, // 창고를 비우기 위해 진행 상태를 0으로 설정
            
          };
        }
        
        return item;
      });
      return newData;
    });

    
  };

  const tableInstance = useTable(
    {
      columns,
      data: tableData, // 데이터 추가
      initialState: {
        pageSize: 5,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
  } = tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="10px" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700" lineHeight="100%">
           Table
        </Text>
        <Menu />
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                >
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "Name") {
                    data = (
                      <Text color={textColor} fontSize="sm" fontWeight="700">
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "Progress") {
                    const progress = cell.value;
                    let status = "Approved";
                    let colorScheme = "green";

                    if (progress < 80) {
                      status = "Disable";
                      colorScheme = "red";
                    } else if (progress < 100) {
                      status = "Warning";
                      colorScheme = "orange";
                    }

                    data = (
                      <Flex align="center" justify="space-between">
                        <div style={{ flex: 1 }}>
                          <Progress
                            variant="table"
                            colorScheme={colorScheme}
                            w="200px"
                            h="8px"
                            value={progress}
                            mb="2px"
                          />
                        </div>
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {progress}% ({status})
                        </Text>
                      </Flex>
                    );
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      maxH="30px !important"
                      py="8px"
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor="transparent"
                    >
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* A창고 비우기 버튼 */}
      <Button
        colorScheme="teal"
        variant="solid"
        size="sm"
        onClick={() => clearWarehouse("A창고")}
        mt="10px"
      >
        A창고 비우기
      </Button>

      {/* B창고 비우기 버튼 */}
      <Button
        colorScheme="teal"
        variant="solid"
        size="sm"
        onClick={() => clearWarehouse("B창고")}
        mt="10px"
      >
        B창고 비우기
      </Button>

      {/* 불량품창고 비우기 버튼 */}
      <Button
        colorScheme="teal"
        variant="solid"
        size="sm"
        onClick={() => clearWarehouse("불량품창고")}
        mt="10px"
      >
        불량품창고 비우기
      </Button>
    </Card>
  );
}
