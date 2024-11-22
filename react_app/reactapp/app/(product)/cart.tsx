import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { useUser } from '../(auth)/UserContext';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get("window");

interface Product {
  id: number;
  productName: string;
  price: string;
  salePrice?: string;
  selectedImagePath: string; 
  selectedColor: string;
  quantity: number; 
  promotions: string[]; // Thêm trường cho khuyến mãi
}

export default function CartScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedPromotions, setSelectedPromotions] = useState<{ [key: number]: string[] }>({});
  const router = useRouter();
  const { userInfo } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    setIsLoading(true);
    axios.get('http://172.20.10.4:8080/api/cart/all')
      .then(response => {
        const productsWithDefaultPromotions = response.data.map((product: any) => ({
          ...product,
          promotions: product.promotions || [] // Default to empty array if undefined
        }));

        // Tạo mảng khuyến mãi ảo
        const promotionsArray = [
          "Giảm giá 10% cho đơn hàng từ 500k",
          "Miễn phí vận chuyển cho đơn hàng đầu tiên",
          "Giảm giá 5% cho lần mua tiếp theo",
          "Mua 1 tặng 1 sản phẩm cùng loại",
          "Giảm thêm 15% cho khách hàng thân thiết",
          "Bảo hành mở rộng 24 tháng",
          "Giảm 50k khi thanh toán online"
        ];

        // Gán khuyến mãi ngẫu nhiên cho sản phẩm
        const productsWithPromotions = productsWithDefaultPromotions.map((product: any) => {
          const randomPromotions = [];
          for (let i = 0; i < 2; i++) { // Lấy 2 khuyến mãi ngẫu nhiên
            const randomIndex = Math.floor(Math.random() * promotionsArray.length);
            randomPromotions.push(promotionsArray[randomIndex]);
          }
          return { ...product, promotions: randomPromotions }; // Gán khuyến mãi vào sản phẩm
        });

        setProducts(productsWithPromotions);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleCheckout = () => {
    if (!userInfo) {
      Toast.show({
        type: 'error',
        text1: 'Chưa đăng nhập',
        text2: 'Bạn cần đăng nhập để thực hiện thanh toán!',
      });
    } else {
      router.push("./pay");
    }
  };

  const handlePromotionSelect = (id: number, promotion: string) => {
    setSelectedPromotions((prevSelected) => {
      const currentPromotions = prevSelected[id] || [];
      if (currentPromotions.includes(promotion)) {
        return {
          ...prevSelected,
          [id]: currentPromotions.filter((p) => p !== promotion),
        };
      } else {
        return {
          ...prevSelected,
          [id]: [...currentPromotions, promotion],
        };
      }
    });
  };

  const increaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const newQuantity = product.quantity + 1;
          updateProductQuantity(id, newQuantity);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const decreaseQuantity = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === id && product.quantity > 1) {
          const newQuantity = product.quantity - 1;
          updateProductQuantity(id, newQuantity);
          return { ...product, quantity: newQuantity };
        }
        return product;
      })
    );
  };

  const removeProduct = (productId: number) => {
    axios.delete(`http://172.20.10.4:8080/api/cart/remove/${productId}`)
      .then(() => {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
      })
      .catch(error => {
        console.log(error);
      });
  };

  const updateProductQuantity = async (id: number, newQuantity: number) => {
    try {
      await axios.put(`http://172.20.10.4:8080/api/cart/update/${id}`, { quantity: newQuantity });
      console.log(`Updated product ${id} quantity to ${newQuantity}`);
    } catch (error) {
      console.error(`Error updating product ${id} quantity:`, error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  const renderProduct = ({ item }: { item: Product }) => {
    const total = item.salePrice ? Number(item.salePrice) : Number(item.price) * item.quantity;
    return (
      <View style={styles.productContainer}>
        <View style={styles.productInnerContainer}>
          <Image source={{ uri: `http://172.20.10.4/images/${item.selectedImagePath}` }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productPrice}>Giá: {item.price}</Text>

            <View style={styles.promotionContainer}>
              <Text style={styles.promotionText}>Chọn khuyến mãi:</Text>
              {item.promotions && item.promotions.map((promotion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promotionCheckbox}
                  onPress={() => handlePromotionSelect(item.id, promotion)}
                >
                  <FontAwesome
                    name={
                      selectedPromotions[item.id]?.includes(promotion)
                        ? "check-square"
                        : "square-o"
                    }
                    size={20}
                    color="#000"
                  />
                  <Text style={styles.promotionLabel}>{promotion}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.colorContainer}>
              <Text style={styles.colorLabel}>Màu:</Text>
              <Text style={styles.colorText}>{item.selectedColor}</Text>
            </View>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => decreaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityNumber}>{item.quantity}</Text>
              </View>
              <TouchableOpacity
                onPress={() => increaseQuantity(item.id)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeProduct(item.id)}
        >
          <FontAwesome name="times" size={24} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Link href="/">
          <Text style={styles.headerText}>
            <Text style={{ fontSize: 20 }}>{"⟨ "}</Text>
            Mua thêm sản phẩm khác
          </Text>
        </Link>
      </View>
  
      {products.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Giỏ hàng trống</Text>
          <Text style={styles.emptyCartSubText}>Bạn hãy tham gia mua sắm cùng chúng tôi.</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.productList}
          />

          <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>
            Tạm tính ({products.length} sản phẩm):
          </Text>
          <Text style={styles.summaryPrice}>
          {products.reduce((total, product) => {
          const price = product.price 
            ? parseFloat(String(product.price).replace(/\./g, ""))
            : 0;
          return total + price * (product.quantity || 1);
        }, 0).toLocaleString("vi-VN")} VND
          </Text>
        </View>
  
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutText}>Đặt hàng</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  productList: {
    paddingBottom: 20,
  },
  productContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    position: "relative", // Để căn chỉnh nút xóa
  },
  productInnerContainer: {
    flexDirection: "row",
    alignItems: "center", // Căn giữa theo chiều dọc
  },
  productImage: {
    width: 100, // Điều chỉnh kích thước hình ảnh nếu cần
    height: 100,
    borderRadius: 10,
    marginRight: 15, // Khoảng cách giữa hình ảnh và thông tin sản phẩm
  },
  productInfo: {
    flex: 1, // Làm cho phần thông tin sản phẩm chiếm hết không gian còn lại
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#e74c3c",
    marginBottom: 5,
  },
  productDiscountPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#999",
    marginBottom: 10,
  },
  promotionContainer: {
    marginBottom: 10,
  },
  promotionText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  promotionCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  promotionLabel: {
    marginLeft: 5,
  },
  morePromotions: {
    color: "#3498db",
    fontSize: 12,
  },
  colorContainer: {
    marginBottom: 10,
  },
  colorLabel: {
    fontWeight: "bold",
  },
  colorText: {
    borderColor: "#999",
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityDisplay: {
    borderColor: "#999",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginHorizontal: 10,
  },
  quantityNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  checkoutButton: {
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 60
  },
  checkoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyCartText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyCartSubText: {
    fontSize: 16,
    color: '#555',
  },
  summaryContainer: {padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 },
  summaryText: { fontSize: 16 },
  summaryPrice: { fontSize: 20, fontWeight: 'bold', color: 'green' },
});
