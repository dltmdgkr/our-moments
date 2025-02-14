import { GiHamburgerMenu } from "react-icons/gi";

export default function HamburgerButton({
  showModal,
  position,
}: {
  showModal: () => void;
  position: any;
}) {
  return (
    <GiHamburgerMenu
      onClick={showModal}
      style={{
        position,
        top: "10px",
        left: "0px",
        fontSize: "24px",
        backgroundColor: "white",
        padding: "10px 12px 10px 7px",
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 2,
      }}
    />
  );
}
