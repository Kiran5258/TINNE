import { Order } from "../model/order.model.js";
import { Product } from "../model/product.model.js";
import { User } from "../model/user.model.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Basic Counts
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();

        // 2. Total Revenue (only paid/delivered orders)
        const revenueAggregation = await Order.aggregate([
            // Consider orders that are NOT cancelled
            { $match: { orderStatus: { $ne: "Cancelled" } } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const totalRevenue =
            revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // 3. Sales Over Time (Last 7 Days) for Chart
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const salesChartData = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo },
                    orderStatus: { $ne: "Cancelled" },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: "$totalAmount" },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Format for frontend (ensure all days are present or just return raw)
        // For simplicity, we return the raw aggregation and let frontend handle sparse data 
        // or we can map it here. Let's return raw for now.

        // 4. Order Status Distribution (Pie Chart)
        const orderStatusDist = await Order.aggregate([
            { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            totalRevenue,
            totalOrders,
            totalProducts,
            totalUsers,
            salesChartData,
            orderStatusDist
        });
    } catch (error) {
        console.log("Error in getDashboardStats controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
