import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'
// isProducts переименовать
function ProductList({ products, isCart, onItemDelete}) {
    return (
        <div className="products-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} isCart={isCart} onItemDelete={onItemDelete} /> 
                ))}
        </div>
    );
}

export default ProductList