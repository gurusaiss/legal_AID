import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OfflineForms() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/document-templates", { replace: true });
  }, [navigate]);
  return null;
}
