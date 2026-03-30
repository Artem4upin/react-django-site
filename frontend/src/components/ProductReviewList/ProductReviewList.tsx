import ProductReview from "../ProductReview/ProductReview";
import {IReview} from "../../types/product";
import './ProductReviewList.scss'
import ProductAddReview from "../ProductAddReview/ProductAddReview";

interface IProductReviewListProps {
    reviews: IReview[];
    productId: number;
}

function ProductReviewList({ reviews, productId }: IProductReviewListProps) {
    return (
        <div className='product-review-list'>
            <h2 className={'product-review-list__title'}>Отзывы</h2>
            <ProductAddReview productId={productId} />
            {reviews.map(review => (
            <ProductReview key={review.id} review={review} />
            ))}

        </div>
    )
}
export default ProductReviewList;