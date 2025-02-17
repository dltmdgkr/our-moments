import { Link } from "react-router-dom";
import { MomentMarkerContextType } from "../context/MomentMarkerContext";
import { GrNext } from "react-icons/gr";

export default function BottomCard({
  selectedMomentMarker,
  setSelectedMomentMarker,
}: MomentMarkerContextType) {
  if (!selectedMomentMarker) return null;

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 5,
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)",
        padding: "12px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <button
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={() => setSelectedMomentMarker(null)}
      >
        x
      </button>

      <img
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${selectedMomentMarker.images[0].key}`}
        alt="moment"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "2px" }}>
          {selectedMomentMarker.location}
        </p>
        <h4 style={{ margin: 0, fontSize: "16px" }}>
          {selectedMomentMarker.title}
        </h4>
        <p style={{ fontSize: "14px", color: "darkred", fontWeight: "bold" }}>
          {selectedMomentMarker.description}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Link to={`/images/${selectedMomentMarker._id}`}>
          <GrNext />
        </Link>
      </div>
    </div>
  );
}
