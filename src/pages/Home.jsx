import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import PCBSpecForm from "./PCBSpecForm";

export default function Home() {

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user, navigate]); 

  return (
   
       <>{user && <PCBSpecForm/>}</>
   
  );
}