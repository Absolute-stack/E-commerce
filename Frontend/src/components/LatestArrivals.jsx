import { useContext, useEffect, useState } from 'react';
import Subtitle from './Subtitle';
import Title from './Title';
import { ShopContext } from '../contxt/ShopContext.jsx';
import ProductItem from './Productitem';

function LatestArrrivals() {
  const { products, setProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);
  async function fetchLatestProducts() {
    setLatestProducts(
      [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
    );
  }

  useEffect(() => {
    fetchLatestProducts();
  }, [products]);
  return (
    <>
      <Title text1={'Latest'} text2={'Arrivals'} />
      <Subtitle
        text={
          'Step into the newest Darkah creations — pieces shaped with intention, designed to echo the quiet power and refined confidence of the modern woman.'
        }
      />
      <div className="img-grid">
        {latestProducts.map((item, index) => {
          return (
            <ProductItem
              key={index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          );
        })}
      </div>
    </>
  );
}

export default LatestArrrivals;
