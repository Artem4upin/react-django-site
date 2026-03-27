import './ProductList.scss'
import {IProduct} from "../../types/product";
import {ICartItem} from "../../types/cart";
import Loading from "../UI/Loading/Loading";
import ProductCard from "../ProductCard/ProductCard";

interface IProductListProps {
    products: IProduct[] | ICartItem[];
    isCart: boolean;
    onItemDelete?: (id: number) => void;
    onCheckboxChange?: (id: number, checked: boolean) => void;
    selectedItems?: number[];
    loadingMore?: boolean;
    nextPage?: string;
    lastProduct?: (node: HTMLDivElement | null) => void;
    className?: string;
}

function ProductList({
        className = 'products-list',
        loadingMore = false,
        nextPage = '',
        products,
        lastProduct,
        isCart = false,
        onItemDelete,
        onCheckboxChange,
        selectedItems = []
}: IProductListProps) {



    return (
        <div className={className}>
            {products.map((item, index) => {
                const isLast = products.length === index + 1 && !!nextPage;
                const ref = isLast ? lastProduct : undefined;
                const id = isCart ? (item as ICartItem).id : (item as IProduct).id;

                if (isCart) {
                    return (
                        <div key={item.id} ref={ref}>
                            <ProductCard
                                data={item}
                                onDelete={onItemDelete}
                                isCart={true}
                                isSelected={selectedItems.includes(id)}
                                onCheckboxChange={onCheckboxChange}
                            />
                        </div>
                    );
                }

                const catalogProduct = item as IProduct;
                return (
                    <div key={catalogProduct.id} ref={ref}>
                        <ProductCard data={catalogProduct} />
                    </div>
                );
            })}

            {loadingMore && <Loading />}
        </div>
    );
}

export default ProductList;