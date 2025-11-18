import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../contxt/ShopContext';
import Title from './Title';
import Subtitle from './Subtitle';
import ProductItem from './Productitem';

function Bestsellers() {
  const { products } = useContext(ShopContext);
  const [bestsellers, setBestsellers] = useState([]);

  // Function to filter and select bestsellers
  async function fetchBestsellers() {
    setBestsellers([...products].filter((item) => item.bestseller).slice(0, 4));
  }

  useEffect(() => {
    fetchBestsellers();
  }, [products]);

  return (
    <>
      <Title text1={'Best'} text2={'Sellers'} />
      <Subtitle
        text={
          'Discover the Darkah signatures women return to — pieces that have earned their place not by trend, but by the way they make you feel unstoppable.'
        }
      />
      {/* Renders the grid container, relying on app.css for responsiveness */}
      <div className="img-grid ">
        {bestsellers.map((item, index) => {
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

export default Bestsellers;
