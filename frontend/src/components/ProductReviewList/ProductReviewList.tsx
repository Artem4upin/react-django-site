import ProductReview from "../ProductReview/ProductReview";
import {IReview} from "../../types/product";
import './ProductReviewList.scss'

interface IProductReviewListProps {
    reviews: IReview[];
}

function ProductReviewList({ reviews }: IProductReviewListProps) {
    return (
        <div className={'product-review-list'}>
            <h2 className={'product-review-list__title'}>Отзывы</h2>
            {reviews.map(review => (
            <ProductReview key={review.id} review={review} />
            ))}

        </div>
    )
}
export default ProductReviewList;