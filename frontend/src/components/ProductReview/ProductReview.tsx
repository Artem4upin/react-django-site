import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import {IReview} from "../../types/product";
import './ProductReview.scss'

interface IProductReviewProps {
    review: IReview;
}

function ProductReview({ review }: IProductReviewProps) {

    return (
        <Card className="product-review">
            <CardContent className="product-review__content">
                <Box className={'product-review__content__header'} display="flex" justifyContent="space-between">
                    <Box className={'product-review__content__header__user'}>
                        <Typography variant="body1" component="div" className={'product-review__content__header__user__name'}>
                            {review.user.username}
                        </Typography>
                        <Typography variant="caption" component="div" className={'product-review__content__user__date'}>
                            {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Rating
                        value={review.rating}
                        readOnly size="small"
                        className={'product-review__content__header__rating'}
                    />
                </Box>

                <Typography variant="body2" component="div" className={'product-review__content__comment'}>
                    {review.comment}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ProductReview