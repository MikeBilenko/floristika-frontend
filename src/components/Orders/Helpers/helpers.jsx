import { useTranslation } from "react-i18next";

const renderDate = (datums) => {
  const date = new Date(datums);
  const day = date.getDate().toString().padStart(2, "0"); // Ensure two digits (e.g., '01')
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
  const year = date.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;
  return formattedDate;
};

const OrderStatusText = ({ status }) => {
  const { t } = useTranslation();
  return <span>{t(`status.${status}`)}</span>;
};

export default OrderStatusText;

export { renderDate };
