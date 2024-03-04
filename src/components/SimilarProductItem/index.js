// Write your code here
// Write your code here
import {withRouter} from 'react-router-dom'
/* here we use withRouter for similarProductItem because, this similarProductItem 
 is does not Routed directly in Route Component , it is indirectly passed as inner component in  productItemDetails Component , 
 where  as  only productItemDetails Component  is passed  directly in Route Component so only history props is 
 available only for directly passed Route Component as  productItemDetails , hence similarProductItem 
 is not directly passed to Route Component history props is not accessible for it , 
 hence to make history props also  accessible for indirectly passed Component or not directly passed 
 to Route component  like similarProductItem , we use withRouter for this type of Component to make accessible history props  */
import './index.css'

const SimilarProductItem = props => {
  const {data} = props
  const {
    similarImageUrl,
    similarTitle,
    similarPrice,
    similarBrand,
    similarRating,
  } = data

  return (
    <li className="similar-product-container">
      <img
        className="similar-product-image"
        src={similarImageUrl}
        alt="similar product"
      />
      <h1 className="similar-product-title">{similarTitle}</h1>
      <p className="similar-product-brand">by {similarBrand}</p>
      <div className="similar-rating-container">
        <p className="similar-product-price">Rs {similarPrice}/-</p>
        <div className="similar-product-rating">
          <p className="similar-rating">{similarRating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default withRouter(SimilarProductItem)
