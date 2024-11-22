import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, TextInput } from 'react-native';

interface Product {
  id: number;
  productName: string;
  price: string;
  selectedImagePath: string; 
  selectedColor: string;
  quantity: number; 
  promotions: string[]; // Thêm trường cho khuyến mãi
}

export default function PaymentScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Gọi API để lấy danh sách sản phẩm
    axios.get('http://172.20.10.4:8080/api/cart/all')
      .then(response => {
        // Ensure promotions is always an array
        const productsWithDefaultPromotions = response.data.map((product: any) => ({
          ...product,
          promotions: product.promotions || [] // Default to empty array if undefined
        }));
        setProducts(productsWithDefaultPromotions);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Dữ liệu ảo cho thông tin đơn hàng
  const orderData = {
    orderId: 'DH123456789',
  };

  const paymentData = {
    service: 'Dịch vụ thanh toán MoMo', // Thêm thuộc tính dịch vụ
    bankName: 'DH123456789',
    accountNumber: 'DCART_86871777_010',
  };

  // Mở modal xác nhận thanh toán
  const handlePayment = () => {
    setIsModalVisible(true);
  };

  // Đóng modal
  const closeModal = () => {
    setIsModalVisible(false);
  };

  // Mở modal đơn hàng
  const handleOrderModal = () => {
    setIsOrderModalVisible(true);
  };

  // Đóng modal đơn hàng
  const closeOrderModal = () => {
    setIsOrderModalVisible(false);
  };
  const calculateTotalPrice = () => {
    return products.reduce((total, product) => {
      const productPrice = product.price ? Number(product.price) : Number(product.price);
      return total + productPrice * product.quantity;
    }, 0);
  };

  const clearCart = () => {
    axios.delete('http://172.20.10.4:8080/api/cart/delete-all')
      .then(() => {
        setProducts([]); // Xóa danh sách sản phẩm trong trạng thái
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const totalPrice = calculateTotalPrice();

  const currentDate = new Date().toLocaleDateString('vi-VN');


  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Phương thức thanh toán</Text>

      {/* Lựa chọn ví MoMo */}
      <TouchableOpacity style={styles.paymentOption} onPress={handleOrderModal}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' }} // Logo MoMo
          style={styles.paymentLogo}
        />
        <Text style={styles.paymentText}>Cổng thanh toán MoMo</Text>
      </TouchableOpacity>

      {/* Modal đơn hàng */}
      <Modal
        visible={isOrderModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeOrderModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Thông tin đơn hàng</Text>
            <Text style={styles.modalText}>Mã đơn hàng: {orderData.orderId}</Text>
            <Text style={styles.modalText}>Số tiền: {totalPrice.toLocaleString('vi-VN')}</Text>

            {/* Nút Thanh Toán */}
            <TouchableOpacity style={styles.paymentButton} onPress={() => {
              closeOrderModal(); // Đóng modal đơn hàng
              handlePayment();   // Mở modal xác nhận thanh toán
            }}>
              <Text style={styles.paymentButtonText}>Thanh Toán</Text>
            </TouchableOpacity>

            {/* Nút đóng */}
            <TouchableOpacity style={styles.closeButton} onPress={closeOrderModal}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận thanh toán */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Chi tiết giao dịch</Text>

            {/* Thông tin thanh toán chi tiết */}
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Dịch vụ</Text>
              <Text style={styles.modalText}>{paymentData.service}</Text>
            </View>
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Mã đơn hàng</Text>
              <Text style={styles.modalText}>{paymentData.bankName}</Text>
            </View>
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Mô tả</Text>
              <Text style={styles.modalText}>{paymentData.accountNumber}</Text>
            </View>
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Ngày thanh toán</Text>
              <Text style={styles.modalText}>{currentDate}</Text>
            </View>
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Tạm tính</Text>
              <Text style={styles.modalText}>{totalPrice.toLocaleString('vi-VN')}</Text>
            </View>
            <Text style={styles.modalText}>
            </Text>
            <Text style={styles.modalText}>
            </Text>
            <Text style={styles.modalText}>
            </Text>
            <Text style={styles.modalText}>
              Bảo mật thông tin & An toàn tài sản của bạn là ưu tiên hàng đầu của MoMo
            </Text>
            
            <TextInput
            style={styles.modalText1}
            placeholder="Nhập mã ưu đãi"
            value=""
            />

            {/* Nút xác nhận thanh toán */}
            <View style={styles.transactionDetail}>
              <Text style={styles.modalText}>Tổng tiền</Text>
              <Text style={styles.modalText}>{totalPrice.toLocaleString('vi-VN')}</Text>
            </View>
            <TouchableOpacity style={styles.confirmButton} onPress={() => {
              clearCart();
              closeModal();
              alert('Thanh toán thành công!\n Cảm ơn bạn đã mua hàng');
              router.push('/');
            }}>
              <Text style={styles.confirmButtonText}>Xác nhận</Text>
            </TouchableOpacity>

            {/* Nút hủy */}
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  paymentLogo: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  paymentText: {
    fontSize: 18,
    fontWeight: '600',
  },
  paymentButton: {
    marginTop: 50,
    backgroundColor: '#e83e52',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: '#e83e52',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#333',
    fontSize: 16,
  },
  transactionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1, // Kẻ khung dưới
    borderBottomColor: '#ccc', // Màu khung
    paddingVertical: 10, // Khoảng cách dọc
    width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng
  },
  modalText1:
    { borderWidth: 2, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 8, width: '100%' },
});
