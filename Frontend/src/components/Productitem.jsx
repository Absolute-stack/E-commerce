import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../contxt/ShopContext';
import './Productitem.css';
function ProductItem({ id, image, name, price }) {
  const { currency } = useContext(ShopContext);
  return (
    <>
      <Link to={`/product/${id}`} className="product-container">
        <div className="product-image-container">
          <img src={image[0]} alt="" />
        </div>
        <div className="flex-sb product-info">
          <p>{name}</p>
          <p>
            {currency}
            {price}
          </p>
        </div>
      </Link>
    </>
  );
}

export default ProductItem;
