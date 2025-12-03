import ProductCard from '../product-card/product-card';
import './product-list.css'

function ProductList({ products }) {
    return (
        <div className="products-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} /> 
                ))}
        </div>
    );
}

export default ProductList