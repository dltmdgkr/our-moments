import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(-1);
  };

  return (
    <IoArrowBack
      onClick={onClick}
      style={{
        position: "sticky",
        top: "10px",
        left: "0px",
        fontSize: "24px",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 2,
      }}
    />
  );
}
