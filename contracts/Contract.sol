// SPDX-License-Identifier: ISC
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract SecureFlow {

    uint256 balance;

    enum ParticipantType { Manufacturer, Wholesaler, Retailer, Consumer }

    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
        uint256 price;
        address manufacturer;
        address wholesaler;
        address retailer;
        address consumer;
    }

    uint256 public productCount; 
    mapping(address => mapping(uint256 => Product)) public products;


    event ProductAdded(uint256 indexed productId, string name, uint256 quantity, uint256 price);
		event OrderCreated(uint256 indexed orderId, address buyer, address seller, uint256 quantity, uint256 amount);
		event OrderDelivered(uint256 indexed orderId, address buyer, address seller, uint256 quantity, uint256 amount, bool isDelivered);
		event throwTotalAmount(uint256 amount);

     struct Order {
        uint256 id;
        uint256 productId;
        address buyer;
        address seller;
        ParticipantType buyerType;
        uint256 quantity;
        uint256 amount;
        uint orderTime;
        bool isDelivered;
        uint deliveryTime;
    }

    uint256 public orderCount;
     mapping(address => mapping(uint256 => Order)) public sellerOrders;
    mapping(address => mapping(uint256 => Order)) public buyerOrders;
    
    function addProduct(string memory name, uint256 quantity, uint256 price, ParticipantType partType) external {
        require(quantity > 0, "Quantity must be greater than 0");
        require(partType == ParticipantType.Manufacturer, "Only Manufacturer can add the product");


        Product storage newProduct = products[msg.sender][productCount];
        newProduct.id = productCount;
        newProduct.name = name;
        newProduct.quantity = quantity;
        newProduct.price = price;
        newProduct.manufacturer = msg.sender;
        products[msg.sender][productCount] = newProduct;
        productCount++;

        emit ProductAdded(productCount, name, quantity, price);
    }

    function placeOrder(
        uint256 productId,
        address seller,
        ParticipantType buyerType,
        uint256 quantity
    ) external payable {


        require(productId >= 0 && productId <= productCount, "Invalid product ID");
        require(seller != address(0), "Invalid seller address");
        require(quantity > 0, "Quantity must be greater than 0");

        Product storage product = products[seller][productId];
        require(product.quantity >= quantity, "Insufficient stock");

        uint256 amount = quantity * (product.price);
				console.log(msg.value, amount);
        require(msg.value >= amount, "Not the correct amount");

        balance = msg.value;

        Order storage newOrder = sellerOrders[seller][orderCount];
        newOrder.id = orderCount;
        newOrder.productId = productId;
        newOrder.buyer = msg.sender;
        newOrder.seller = seller;
        newOrder.quantity = quantity;
        newOrder.amount = amount;
        newOrder.isDelivered = false;
        newOrder.buyerType = buyerType;

        sellerOrders[seller][orderCount] = newOrder;
				buyerOrders[msg.sender][orderCount] = newOrder;
        orderCount++;

			emit OrderCreated(newOrder.id, newOrder.buyer, newOrder.seller, quantity, amount);
    }

     function markOrderDelivered(uint256 orderId) external payable {
        require(orderId >= 0 && orderId <= orderCount, "Invalid order ID");
        Order storage order = sellerOrders[msg.sender][orderId];
				
        require(!order.isDelivered, "Order is already delivered");
        require(order.seller == msg.sender, "You are not the seller of this order");

        address buyer = order.buyer;
        Product storage product = products[msg.sender][order.productId];

        product.quantity -= order.quantity;

        Product storage newProduct = products[buyer][order.productId];
        newProduct.id = order.productId;
        newProduct.name = product.name;
        newProduct.quantity = order.quantity;
        newProduct.price = product.price;

        if(order.buyerType == ParticipantType.Wholesaler) {
            product.wholesaler = buyer;
        } else if(order.buyerType == ParticipantType.Retailer) {
            product.retailer = buyer;
        } else if(order.buyerType == ParticipantType.Consumer) {
            product.consumer = buyer;
        }

        newProduct.manufacturer = product.manufacturer;
        newProduct.wholesaler = product.wholesaler;
        newProduct.retailer = product.retailer;

        products[buyer][order.productId] = newProduct;
        payable(order.seller).transfer(balance);
        balance = 0;

        order.isDelivered = true;

			emit OrderDelivered(order.id, order.buyer, order.seller, order.quantity, order.amount, order.isDelivered);
    }

    function getManufacturer(uint256 productId) external view returns (address) {
        require(productId >= 0 && productId <= productCount, "Invalid product ID");
        Product storage product = products[msg.sender][productId];
        return product.manufacturer;
    }

    function getWholeSaler(uint256 productId) external view returns (address) {
        require(productId >= 0 && productId <= productCount, "Invalid product ID");
        Product storage product = products[msg.sender][productId];
        return product.wholesaler;
    }

    function getRetailer(uint256 productId) external view returns (address) {
        require(productId >= 0 && productId <= productCount, "Invalid product ID");
        Product storage product = products[msg.sender][productId];
        return product.wholesaler;
    }
	
    function getConsumer(uint256 productId) external view returns (address) {
        require(productId >= 0 && productId <= productCount, "Invalid Product ID");
        Product storage product = products[msg.sender][productId];
        return product.consumer;
    }

		function getProductsData(address participant) external view returns (Product[] memory) {
				Product[] memory prods = new Product[](productCount);
				for(uint i; i<productCount; i++) {
						Product storage prod = products[participant][i];
						prods[i] = prod;
				}
				return prods;
		}

    function getProductsDataParticipants(address[] memory participants) external view returns (Product[] memory) {
        Product[] memory prods = new Product[](productCount * participants.length);
        uint count;
        for(uint i; i<participants.length; i++) {
            for(uint j; j<productCount; j++) {
                Product storage prod = products[participants[i]][j];
                prods[count] = prod;
                count++;
            }
        }

        return prods;
    }

    function getSellerOrdersDataDelivered(address participant) external returns (Order[] memory) {
        Order[] memory ords = new Order[](orderCount);
				uint256 totalAmount;
        for(uint i; i<orderCount; i++) {
            Order storage ord = sellerOrders[participant][i];
						if(ord.isDelivered == true) {
       	    	ords[i] = ord;
							totalAmount+=ord.amount;
						}
        }
				emit throwTotalAmount(totalAmount);
        return ords;
    }

		function getSellerOrdersData(address participant) external view returns (Order[] memory) {
        Order[] memory ords = new Order[](orderCount);
        for(uint i; i<orderCount; i++) {
            Order storage ord = sellerOrders[participant][i];
						if(ord.isDelivered == false) {
       	    	ords[i] = ord;
						}
            ords[i] = ord;
        }
        return ords;
    }

    function getBuyerOrdersData(address participant) external view returns (Order[] memory) {
        Order[] memory ords = new Order[](orderCount);
        for(uint i; i<orderCount; i++) {
            Order storage ord = buyerOrders[participant][i];
            ords[i] = ord;
        }
        return ords;
    }
}