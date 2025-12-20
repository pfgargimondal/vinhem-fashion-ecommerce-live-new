import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table';
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/OrderHistory.module.css";
import { useAuth } from "../../context/AuthContext";
import http from "../../http";
import { useEffect, useState } from "react";
// eslint-disable-next-line
import { downloadInvoicePDF } from "../../utils/downloadInvoice";
import Invoice from "../Invoice/Invoice";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line
import jsPDF from "jspdf";
// eslint-disable-next-line
import html2canvas from "html2canvas";
import Loader from "../../components/Loader/Loader";

export const OrderHistory = () => {

    const { token } = useAuth();
    const [OrderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
 
    const currentYear = new Date().getFullYear();

    const years = [
    `${currentYear - 2} - ${currentYear}`, 
    ...Array.from(
        { length: currentYear - 2016 },
        (_, i) => (currentYear - 1 - i).toString()
    ),
    ];

    const [selected, setSelected] = useState(years[0]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    // eslint-disable-next-line
    const [user, setUser] = useState(null);
    // eslint-disable-next-line
    const [userOrderProduct , setuserOrderProduct] = useState(null);


    useEffect(() => {
        if (!token) return;
        setLoading(true);

        const fetchOrderHistory = async () => {
        try {
            const res = await http.get("/user/get-order-history", {
            headers: { Authorization: `Bearer ${token}` },
            });

            const orders = res?.data?.data?.orders || [];

            setOrderHistory(orders);
            setFilteredOrders(orders);
            setUser(res?.data?.data?.user || null);
            setuserOrderProduct(
                res?.data?.data?.user_order_product_details || null
            );

        } catch (error) {
            console.error("Failed to fetch order history", error);
        } finally {
            setLoading(false);
        }
    };

        fetchOrderHistory();
    }, [token]);


    
    /* =======================
        SEARCH FILTER LOGIC
    ======================= */
    useEffect(() => {
        if (!search.trim()) {
        setFilteredOrders(OrderHistory);
        return;
        }

        const lowerSearch = search.toLowerCase();

        const filtered = OrderHistory.filter((order) => {
        // Order No
        const orderNoMatch = order?.order_id
            ?.toString()
            .toLowerCase()
            .includes(lowerSearch);

        // // Product Name
        // const productMatch = order?.order_items?.some((item) =>
        //     item?.product_name?.toLowerCase().includes(lowerSearch)
        // );

        // // Designer Name
        // const designerMatch = order?.order_items?.some((item) =>
        //     item?.designer_name?.toLowerCase().includes(lowerSearch)
        // );

        // return orderNoMatch || productMatch || designerMatch;
        return orderNoMatch;
        });

        setFilteredOrders(filtered);
    }, [search, OrderHistory]);


    useEffect(() => {
        if (!OrderHistory || !selected) return;

        let filtered = [];

        // If the selected option is a range like "2023 - 2025"
        if (selected.includes("-")) {
            const [start, end] = selected.split("-").map(y => Number(y.trim()));
            filtered = OrderHistory.filter(order => {
                const orderYear = new Date(order.order_date).getFullYear();
                return orderYear >= start && orderYear <= end;
            });
        } else {
            // Single year
            const year = Number(selected);
            filtered = OrderHistory.filter(order => {
                return new Date(order.order_date).getFullYear() === year;
            });
        }

        setFilteredOrders(filtered);
    }, [selected, OrderHistory]);


    const navigate = useNavigate();



    const handleDownload = async (order) => {
        try {
            const res = await http.get("/user/get-invoice-details", {
            headers: { Authorization: `Bearer ${token}` },
            params: { id: order.order_id }, // 👈 send order_id as 'id'
            });

            const data = res.data.data || {};
            const userInfo = data.user || null;
            const orderProductDetails = data.user_order_product_details || null;
            const getProductDetails = data.get_product_details || null;
            const getGSTDetails = data.get_gst_value || null;

            

            localStorage.setItem(
            "invoiceData",
            JSON.stringify({
                order,
                user: userInfo,
                userOrderProduct: orderProductDetails,
                getProductDetails: getProductDetails,
                getGSTDetails: getGSTDetails,
            })
            );

        navigate("/invoice", {
        state: {
            order,
            user: userInfo,
            userOrderProduct: orderProductDetails,
            getProductDetails: getProductDetails,
            getGSTDetails: getGSTDetails,
            pdfView: true, // signal PDF preview
        },
        });
        } catch (error) {
            console.error("❌ Failed to fetch invoice details:", error);
        }
    };

    const handleCancelOrder = async (order) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
        const token = localStorage.getItem("token");
        const response = await http.post(
        `/user/cancel-order/${order.order_id}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );

        if (response.data.success) {
        alert("Your order has been cancelled successfully!");
        navigate("/order-history"); 
        } else {
        alert(`${response.data.message || "Failed to cancel order"}`);
        }
    } catch (err) {
        console.error(err);
        alert(" Something went wrong while cancelling the order.");
    }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles.ffhfdf}>
            <div className="ansjidnkuiweer">
                <div className={styles.fbghdfg}>
                    <div className="row">
                        <div className="col-lg-3">
                            <UserProfileNavMenu />
                        </div>

                        <div className="col-lg-9">
                            <div className={`${styles.fgcbdfgdf} pt-3 pb-5`}>
                             <div className={`${styles.dfjhdsbfsdf} mb-4`}>
                                    <h4 className="mb-0">Order History</h4>

                                    <div className={styles.customSearchWrapper}>
                                        <i className={`bi bi-search ${styles.customSearchIcon}`}></i>

                                        <input
                                        type="text"
                                        className={styles.customSearchInput}
                                        placeholder="Search by Order No."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}

                                        />
                                    </div>

                                      <div className={styles.filterWrapper}>
                                        <button
                                            className={styles.filterBtn}
                                            onClick={() => setOpen(!open)}
                                        >
                                            <i className="bi bi-sliders"></i>
                                            Filter
                                        </button>

                                        {open && (
                                        <div className={styles.dropdown}>

                                            {/* Selected option pinned at top */}
                                            <div
                                            className={`${styles.option} ${styles.active}`}
                                            style={{ pointerEvents: "none" }}
                                            >
                                            {selected}
                                            </div>

                                            {/* Other options */}
                                            {years
                                            .filter((year) => {
                                                // remove the selected range itself
                                                if (year === selected) return false;

                                                // hide years inside selected range
                                                if (selected.includes("-") && !year.includes("-")) {
                                                const [start, end] = selected.split("-").map(Number);
                                                const y = Number(year);
                                                return y < start || y > end;
                                                }

                                                // hide selected single year
                                                if (!selected.includes("-") && year === selected) {
                                                return false;
                                                }

                                                return true;
                                            })
                                            .map((year, index) => (
                                                <div
                                                key={index}
                                                className={styles.option}
                                                onClick={() => {
                                                    setSelected(year);
                                                    setOpen(false);
                                                }}
                                                >
                                                {year}
                                                </div>
                                            ))}
                                        </div>
                                        )}
                                        </div>

                                    <p className="ndiwhermweoewrr mb-0 d-none">
                                        <Link to="/">
                                        <i className="fa-solid me-1 fa-arrow-left"></i>
                                        Back To Home
                                        <i className="fa-solid ms-1 fa-house"></i>
                                        </Link>
                                    </p>
                                    </div>


                                <div className={styles.dfgndfjhbgdfgdf}>
                                    <Table striped responsive bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Order Id</th>

                                                <th>Order Information</th>

                                                <th>Date</th>

                                                <th>Total Amount</th>

                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        
                                        <tbody>
                                            {filteredOrders.length > 0 ? (
                                                filteredOrders.map((orderHistoryVal) => (
                                                <tr>
                                                    <td>{orderHistoryVal.order_id}</td>

                                                    <td>
                                                        <div className={`${styles.sdfsdf} justify-content-between mb-3`}>
    
                                                            <p className="mb-0">No. of items: {orderHistoryVal.total_orderProduct}</p> 

                                                            <p className={`${styles.oknknkmer} mb-0`}   onClick={() => navigate(`/order-details/${orderHistoryVal.order_id}`)} ><i class={`bi ${styles.vew_dtls} bi-eye`}></i> View Details</p>
                                                        </div>

                                                        <div className={`d-flex ${styles.dweknriwehrwer} align-items-center justify-content-between`}>
                                                            {orderHistoryVal.order_status === "Placed" ? (
                                                                <button className={`btn ${styles.cncl_ordr} border-0 px-0`} onClick={() => handleCancelOrder(orderHistoryVal)}>
                                                                    <i className="bi me-1 bi-folder-x"></i> Cancel Order
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Pending" ? (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-clock-history"></i> Pending Order
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Shipped" ? (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-folder-x"></i> Cancellation Not Available
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Delivered" ? (
                                                                <button className={`btn ${styles.return_ordr} border-0 px-0`}>
                                                                    <i className="bi me-1 bi-folder-x"></i> Return Order
                                                                </button>
                                                                ) : orderHistoryVal.order_status === "Returned" ? (
                                                                <button className={`btn ${styles.return_ordr} border-0 px-0`}>
                                                                    <i className="bi me-1 bi-folder-x"></i> Return Completed
                                                                </button>
                                                                ) : (
                                                                <button className="btn border-0 px-0 text-muted">
                                                                    <i className="bi me-1 bi-folder-x"></i> Cancellation Not Available
                                                                </button>
                                                                )}
                                                                {orderHistoryVal.order_status === "Delivered" && (
                                                                    <button className={`btn ${styles.dwnld_invce} text-success border-0 px-0`} onClick={() => handleDownload(orderHistoryVal)}>
                                                                        <i class="bi me-1 bi-file-earmark-arrow-down"></i> Download Invoice</button>
                                                                )}
                                                            
                                                        </div>
                                                        <div style={{ display: "none" }}>
                                                            <Invoice />
                                                        </div>
                                                    </td>

                                                    <td> {orderHistoryVal.order_date
                                                        ? orderHistoryVal.order_date.split("-").reverse().join("-")
                                                        : ""}</td>

                                                    <td>₹{orderHistoryVal.total_order_amount}</td>

                                                    <td>
                                                        {orderHistoryVal.order_status === "Placed" ? (
                                                            <button className={styles.dfgfd5544}>{orderHistoryVal.order_status}</button>
                                                        ) : orderHistoryVal.order_status === "Pending" ? (
                                                            <button className={styles.dfgfd5544c}>{orderHistoryVal.order_status}</button>
                                                        ) : orderHistoryVal.order_status === "Shipped" ? (
                                                            <button className={styles.dfgfd5544b}>{orderHistoryVal.order_status}</button>
                                                        ) : orderHistoryVal.order_status === "Deliverd" ? (
                                                            <button className={styles.dfgfd5544}>{orderHistoryVal.order_status}</button>
                                                        ) : orderHistoryVal.order_status === "Returned" ? (
                                                            <button className={styles.dfgfd5544dvxc}>{orderHistoryVal.order_status}</button>
                                                        ) : (
                                                            <button className={styles.dfgfd5544}>{orderHistoryVal.order_status}</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                            ) : (
                                                !loading && (
                                                <p className={styles.noDataText}>No orders found</p>
                                                )
                                            )}
                                            
                                            {/* <tr>
                                                <td>AC7875845</td>

                                                <td>
                                                    <div className={styles.sdfsdf}>
                                                        <div className={styles.dsfhsd}>
                                                            <img src="./images/product1 (1).webp" alt="" />
                                                        </div>
                                                        <div className={styles.dbhdsf512}>
                                                            <h6>World's Most Expensive T Shirt</h6>
                                                            <p>Women's Clothes</p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>17-07-25</td>

                                                <td>$1,190</td>

                                                <td>
                                                    <button className={styles.dfgfd5544a}>Cancel</button>
                                                </td>
                                            </tr> */}
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
