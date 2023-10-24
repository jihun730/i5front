import React, { useMemo, useState, useEffect } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Button,
} from "@chakra-ui/react";

// Custom components
import Card from "components/card/Card";
import Menu from "components/menu/MainMenu";
import ProductEditModal from "./ProductEditModal";
import axios from "axios";

export let totalResult = 0;

export default function CheckTable() {
  const columnsData = useMemo(
    () => [
      {
        Header: "NAME",
        accessor: "name",
      },
      {
        Header: "PRICE",
        accessor: "price",
      },
      {
        Header: "QUANTITY",
        accessor: "quantity",
      },
      {
        Header: "FQUANTITY",
        accessor: "fquantity",
      },
      {
        Header: "DATE",
        accessor: "date",
      },
    ],
    []
  );

  const formatPrice = (price) => {
    const formatter = new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    });
    return formatter.format(price);
  };

  // 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      const response = await axios.get("http://10.10.10.111:8080/product/"); // API 엔드포인트를 수정하세요.
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchData();
  }, []); 

  const [tableData, setTableData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  useEffect(() => {
    fetchData();

    // 데이터를 가져온 후 각 상품의 총 가격을 계산하고 합산합니다.
    const calculatedTotalPrice = tableData.reduce((total, product) => {
      const productPrice = (product.quantity - product.fquantity) * product.price;
      return total + productPrice;
    }, 0);
    
    totalResult = calculatedTotalPrice;
    setTotalPrice(calculatedTotalPrice); // 총 가격 상태 변수 업데이트
  }, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
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
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const handleProductEdit = async (updatedProductData) => {
    try {
      const response = await axios.put(
        `http://10.10.10.111:8080/product/${updatedProductData.id}`,
        updatedProductData
      );

      if (response.status === 200) {
        console.log("상품 수정 성공!");
      } else {
        console.error("상품 수정 실패");
      }
    } catch (error) {
      console.error("상품 수정 오류:", error);
    }

  
    const updatedTableData = tableData.map((product) => {
      if (product.id === updatedProductData.id) {
        return updatedProductData;
      }
      return product;
    });

    setTableData(updatedTableData);
    setIsEditModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditSelectedRows = (rowData) => {
    setSelectedProduct(rowData);
    setIsEditModalOpen(true);
  };

  const deleteSelectedRows = async (productId) => {
    try {
      await axios.delete(`http://10.10.10.111:8080/product/${productId}`);
      const updatedTableData = tableData.filter((row) => row.id !== productId);
      setTableData(updatedTableData);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
      overflowY="auto" // 스크롤바 추가
      maxHeight="400px" // 최대 높이 설정
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          Check Table {formatPrice(totalPrice)}
        </Text>
        <Menu />
      </Flex>
      <Flex align="center"> {/* 새로운 Flex 컨테이너 */}
  </Flex>
      <Flex justify="space-between" align="center">
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
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
                    if (cell.column.Header === "NAME") {
                      data = (
                        <Flex align="center">
                          <Text color={textColor} fontSize="sm" fontWeight="700">
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "PRICE") {
                      data = (
                        <Flex align="center">
                          <Text
                            me="10px"
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "QUANTITY") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "FQUANTITY") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "DATE") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                  <Td fontSize="14px" minW="auto" borderColor="transparent">
                    <Button
                      onClick={() => handleEditSelectedRows(row.original)}
                      colorScheme="blue"
                      size="sm"
                      mr="2"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={() => deleteSelectedRows(row.original.id)}
                      colorScheme="red"
                      size="sm"
                    >
                      삭제
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <ProductEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          productData={selectedProduct}
          onSave={handleProductEdit}
        />
      </Flex>
    </Card>
  );
}
