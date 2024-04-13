import { useTranslation } from "react-i18next";

const renderDate = (datums) => {
  const date = new Date(datums);
  const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits (e.g., '01')
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
};

const getOrderStatusText = (status) => {
  // const { t } = useTranslation();
  switch (status) {
    case "pending":
      return "Pending";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    case "refunded":
      return "Refunded";
    case "on-hold":
      return "On Hold";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
};
const OrderStatusText = ({ status }) => {
  const { t } = useTranslation();
  return <span>{t(`status.${status}`)}</span>;
};

export default OrderStatusText;

export { renderDate, getOrderStatusText };
