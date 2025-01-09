import { useEffect } from "react";
import { pcbAPI,componentsAPI } from "../services/api/endpoints";
export default function About() {
   useEffect(() => {
      const fetchInitialData = async () => {
        try {
        
          const [specs, components,getbyid, groupings] = await Promise.all([
            pcbAPI.getSpecification(1),
            componentsAPI.getAll(),
            componentsAPI.getById(1),

            pcbAPI.getSectionGroupings(1)

          ]);
          
         console.log("log",{specs,components,getbyid,groupings})
        } catch (err) {
          console.error(err.message);
        } 
      };
  
      fetchInitialData();
    }, []);
  return (
    <div>
      <h1>About Page</h1>
    </div>
  );
}