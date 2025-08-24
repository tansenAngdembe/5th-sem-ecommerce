import Card from "../Card";
import { Provider } from "../../context/contextProvider";
const ProductByCategory = ({ cata }) => {
    const { state, addToCart, successCart } = Provider();
    const uri = import.meta.env.VITE_IMAGE;
    const filteredProducts = state.products.filter((product) => {
        let word = cata.toLowerCase().split(" ");
        word.pop();
        let word1 = word.join(" ").split(" ").reverse().join("");
        // console.log(word1) 
        // console.log(product.category.toLowerCase().split(" ").join(""))
        return product.category.toLowerCase().split(" ").join("").startsWith(word1);
    }
    )
    // console.log(cata.split(" ").pop())

    return (
        <div>
            <section className="grid grid-cols-5 m-4 gap-4 " >
                <Card products={filteredProducts}/>
            </section>
        </div>
    )
}
export default ProductByCategory;