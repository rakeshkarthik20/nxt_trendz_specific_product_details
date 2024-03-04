// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemData: [],
    similarData: [],
    count: 1,
    status: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.renderItemDetails()
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count === 1) {
      return
    }
    this.setState(prevState => ({
      count: prevState.count - 1,
    }))
  }

  increaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  renderItemDetails = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      const similarData = data.similar_products.map(each => ({
        similarId: each.id,
        similarImageUrl: each.image_url,
        similarTitle: each.title,
        similarStyle: each.style,
        similarPrice: each.price,
        similarDescription: each.description,
        similarBrand: each.brand,
        similarTotalReviews: each.total_reviews,
        similarRating: each.rating,
        similarAvailability: each.availability,
      }))
      //   console.log(similarData, updatedData)
      this.setState({
        itemData: updatedData,
        similarData,
        status: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({
        status: apiStatusConstants.failure,
      })
    }
  }

  continueShopping = () => {
    const {history} = this.props
    console.log(history)
    history.replace('/products')
  }

  renderSuccessView = () => {
    const {itemData, similarData, count} = this.state
    console.log(similarData)
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = itemData
    return (
      <div className="product-sections">
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div>
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-main-class">
              <div className="rating-class">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="start-image"
                />
              </div>
              <p className="product-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <div className="product-availability product-details">
              <span className="bold-content">Available: </span>
              <p>{availability}</p>
            </div>
            <div className="product-brand product-details">
              <span className="bold-content">Brand: </span>
              <p>{brand}</p>
            </div>
            <hr />
            <div className="add-to-cart-container">
              <button
                type="button"
                className="decrement-btn"
                onClick={this.decreaseCount}
                data-testid="minus"
                aria-label="Decrement count"
              >
                <BsDashSquare />
              </button>
              <p className="cart-count">{count}</p>
              <button
                type="button"
                className="increment-btn"
                onClick={this.increaseCount}
                data-testid="plus"
                aria-label="Increment count"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="similar-items-container">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="similar-products-list">
            {similarData.map(each => (
              <Link
                to={`/products/${each.similarId}`}
                key={each.similarId}
                className="link-item"
              >
                <SimilarProductItem id={each.similarId} data={each} />
              </Link>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="error-img"
      />
      <h1 className="error-msg">Product Not Found</h1>
      <button
        type="button"
        className="continue-btn"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProductDetails = () => {
    const {status} = this.state

    switch (status) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
