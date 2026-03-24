import  { useContext } from "react"
import "./ProductCard.scss"
import Button from "../UI/Buttons/Button"
import { useNavigate } from 'react-router-dom';
import { addToCart, goToProduct } from "../../utils/functions";
import { AuthContext } from "../../hooks/AuthContext";
import {IProduct} from "../../types/product";

interface IProductCardCatalogProps {
    product: IProduct;
    onAddToCart?: (id: number, quantity: number, name: string) => void;
}

function ProductCardCatalog({ product }: IProductCardCatalogProps) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleProductClick = () => goToProduct(navigate, product.id);
    const handleAddToCart = () => addToCart(product.id, 1, product.name);

    return (
        <div className="product-card">
            <div className="product-card__image-container" onClick={handleProductClick}>
                {product.image_pass ? (
                    <img src={product.image_pass} alt={product.name} className="image-container__image" />
                ) : (
                    <p className="image-container_no-image">Нет изображения</p>
                )}
            </div>

            <div className="product-card__info-container">
                <h3 className="product-card__title" onClick={handleProductClick}>
                    {product.name}
                </h3>
                <p className="product-card__price">{product.price} ₽</p>

                <div className="product-card__parameters">
                    <h4>Характеристики</h4>
                    <ul className="product-card__list">
                        {product.parameters?.map((p, i) => (
                            <li key={i}>
                                {p.name}: {p.value}
                            </li>
                        ))}
                    </ul>
                </div>

                {user && (
                    <Button className="add-to-cart-btn" text="В корзину" onClick={handleAddToCart} />
                )}
            </div>
        </div>
    );
}

export default ProductCardCatalog;