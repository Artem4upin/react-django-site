import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'

function ProductList({ 
    products,
    isCart, 
    onItemDelete,
    selectedItems = [],
    onCheckboxChange,  
    className='products-list'}) {
    return (
        <div className={className}>
                {products.map(product => (
                    <ProductCard 
                    key={product.id} 
                    product={product} 
                    isCart={isCart} 
                    onItemDelete={onItemDelete}
                    isSelected={selectedItems.includes(product.id)}
                    onCheckboxChange={onCheckboxChange}
                    /> 
                ))}
        </div>
    );
}

export default ProductList