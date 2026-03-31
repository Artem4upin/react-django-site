import { Card, CardContent, Typography, Rating, Box } from '@mui/material';
import {IReview} from "../../types/product";
import './ProductReview.scss'

interface IProductReviewProps {
    review: IReview;
}

function ProductReview({ review }: IProductReviewProps) {

    return (
        <Card className="product-review">
            <CardContent >
                <Box className='product-review__header' display="flex" justifyContent="space-between">
                    <Box>
                        <Typography variant="body1" component="div" >
                            {review.user.username}
                        </Typography>
                        <Typography variant="caption" component="div" >
                            {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        precision={0.1}
                    />
                </Box>

                <Typography variant="body2" component="div" className='product-review__comment'>
                    {review.comment}
                </Typography>
                {review.image_path &&(
                <Box className='product-review__image-container'
                >
                    <img
                        className='product-review__image'
                        src={review.image_path}
                        alt='Изображение'
                    />
                </Box>
                )}
            </CardContent>
        </Card>
    )
}

export default ProductReview