import './ProductList.css'
import {IProduct} from "../../types/product";
import {ICartItem} from "../../types/cart";
import ProductCardCatalog from "../ProductCard/ProductCardCatalog";
import ProductCardCart from "../ProductCard/ProductCardCart";

type TProductListProps =
    | {
    isCart: true;
    products: ICartItem[];
    onItemDelete: (id: number) => void;
    onCheckboxChange: (id: number, checked: boolean) => void;
    selectedItems: number[];
    loadingMore?: boolean;
    nextPage?: string;
    lastProduct?: (node: HTMLDivElement | null) => void;
    className?: string;
}
    | {
    isCart?: false;
    products: IProduct[];
    onItemDelete?: never;
    onCheckboxChange?: never;
    selectedItems?: never;
    loadingMore?: boolean;
    nextPage?: string;
    lastProduct?: (node: HTMLDivElement | null) => void;
    className?: string;
};

function ProductList(props: TProductListProps) {
    const { className = 'products-list', loadingMore = false, nextPage = '', products, lastProduct } = props;

    return (
        <div className={className}>
            {products.map((item, index) => {
                const isLast = products.length === index + 1 && !!nextPage;
                const ref = isLast ? lastProduct : undefined;

                if (props.isCart) {
                    const cartItem = item as ICartItem;
                    return (
                        <div key={cartItem.id} ref={ref}>
                            <ProductCardCart
                                item={cartItem}
                                onDelete={props.onItemDelete}
                                isSelected={props.selectedItems.includes(cartItem.id)}
                                onCheckboxChange={props.onCheckboxChange}
                            />
                        </div>
                    );
                }

                const catalogProduct = item as IProduct;
                return (
                    <div key={catalogProduct.id} ref={ref}>
                        <ProductCardCatalog product={catalogProduct} />
                    </div>
                );
            })}

            {loadingMore && <div className="loading-more">Загрузка...</div>}
        </div>
    );
}

export default ProductList;