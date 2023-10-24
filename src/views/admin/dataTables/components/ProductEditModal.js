import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";

export default function ProductEditModal({ isOpen, onClose, productData, onSave }) {
  const [editedProduct, setEditedProduct] = useState({ ...productData });

  // productData가 변경될 때마다 editedProduct을 업데이트합니다.
  useEffect(() => {
    setEditedProduct({ ...productData });
  }, [productData]);

  const handleSave = () => {
    onSave(editedProduct); // 수정된 상품 정보를 상위 컴포넌트로 전달
    onClose(); // 팝업 창 닫기
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>상품 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Name 수정 입력 필드 */}
          <Text>상품명:</Text>
          <Input
            placeholder="상품명"
            value={editedProduct.name}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, name: e.target.value })
            }
          />

          {/* Price 수정 입력 필드 */}
          <Text>가격:</Text>
          <Input
            type="number"
            placeholder="가격"
            value={editedProduct.price}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, price: e.target.value })
            }
          />

          {/* Quantity 수정 입력 필드 */}
          <Text>수량:</Text>
          <Input
            type="number"
            placeholder="수량"
            value={editedProduct.quantity}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, quantity: e.target.value })
            }
          />

          {/* Fquantity 수정 입력 필드 */}
          <Text>불량품:</Text>
          <Input
            type="number"
            placeholder="불량품"
            value={editedProduct.fquantity}
            onChange={(e) =>
              setEditedProduct({ ...editedProduct, fquantity: e.target.value })
            }
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            저장
          </Button>
          <Button onClick={onClose}>취소</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
