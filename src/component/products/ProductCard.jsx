import { Provider } from "../../context/contextProvider";
import Card from "../Card";

const uri = import.meta.env.VITE_IMAGE;
const ProductCard = () => {
  const { state } = Provider();

  return (    
      <Card products={state.products}/>

  );
};


export default ProductCard;