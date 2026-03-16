import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'

function ProductList({
    products = [],
    isCart = false,
    onItemDelete = () => {},
    selectedItems = [],
    onCheckboxChange = () => {},
    loadingMore = false,
    nextPage = '',
    lastProduct = () => {},
    className='products-list'}) {

    return (
        <div className={className}>
                {products.map((product, index) => {
                    if (products.length === index + 1 && nextPage) {
                        return (
                            <div key={product.id} ref={lastProduct}>
                                <ProductCard
                                    product={product}
                                    isCart={isCart}
                                    onItemDelete={onItemDelete}
                                    isSelected={selectedItems.includes(product.id)}
                                    onCheckboxChange={onCheckboxChange}
                                />
                            </div>
                        )
                    }
                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                            isCart={isCart}
                            onItemDelete={onItemDelete}
                            isSelected={selectedItems.includes(product.id)}
                            onCheckboxChange={onCheckboxChange}
                        />
                    );
                })}
            {loadingMore && <div className="loading-more">Загрузка</div>}

        </div>
    );
}

export default ProductList