import { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assest';
import './Add.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/Admincontext';
function Add() {
  const [loading, setLoading] = useState(false);
  const { backend } = useContext(AdminContext);
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [sizes, setSizes] = useState([]);
  const [bestseller, setBestSeller] = useState(false);

  function handleClick(size) {
    if (sizes.includes(size)) {
      setSizes((prevArr) => prevArr.filter((item) => item !== size));
    } else {
      setSizes((prevArr) => [...prevArr, size]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('price', price);
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);
      formData.append('category', category);
      formData.append('subCategory', subCategory);
      formData.append('sizes', JSON.stringify(sizes));
      formData.append('bestseller', bestseller);

      const res = await axios.post(backend + '/api/product/add', formData);

      setImage1(false);
      setImage2(false);
      setImage3(false);
      setImage4(false);
      setName('');
      setDesc('');
      setPrice('');
      setCategory('');
      setSubCategory('');
      setSizes([]);
      toast.success(res.data.message);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || 'Something Went Wrong');
    }
  }

  return (
    <>
      <form action="#" onSubmit={handleSubmit} className="add-form">
        <div className="add-form-item upload-container flex gap-1">
          <div className="upload-container-item">
            <label htmlFor="image1" className="image-label">
              <img
                src={!image1 ? assets.upload_icon : URL.createObjectURL(image1)}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              style={{ display: 'none' }}
            />
          </div>
          <div className="upload-container-item">
            <label htmlFor="image2" className="image-label">
              <img
                src={!image2 ? assets.upload_icon : URL.createObjectURL(image2)}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage2(e.target.files[0])}
              type="file"
              id="image2"
              style={{ display: 'none' }}
            />
          </div>
          <div className="upload-container-item">
            <label htmlFor="image3" className="image-label">
              <img
                src={!image3 ? assets.upload_icon : URL.createObjectURL(image3)}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage3(e.target.files[0])}
              type="file"
              id="image3"
              style={{ display: 'none' }}
            />
          </div>
          <div className="upload-container-item">
            <label htmlFor="image4" className="image-label">
              <img
                src={!image4 ? assets.upload_icon : URL.createObjectURL(image4)}
                alt=""
              />
            </label>
            <input
              onChange={(e) => setImage4(e.target.files[0])}
              type="file"
              id="image4"
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="add-form-item">
          <label htmlFor="name">Product Name</label>
          <input
            onInput={(e) => setName(e.target.value)}
            type="text"
            id="name"
            value={name}
          />
        </div>
        <div className="add-form-item">
          <label htmlFor="desc">Product Desc</label>
          <textarea
            onInput={(e) => setDesc(e.target.value)}
            id="desc"
            placeholder="Write Product Description Here..."
            value={desc}
          ></textarea>
        </div>
        <div className="add-form-item">
          <label htmlFor="price">Product Price</label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            id="price"
            placeholder="500"
            value={price}
          />
        </div>
        <div className="add-form-item">
          <label htmlFor="category">Product Category</label>
          <input
            onInput={(e) => setCategory(e.target.value)}
            type="text"
            id="category"
            value={category}
          />
        </div>
        <div className="add-form-item">
          <label htmlFor="subcategory">Product SubCategory</label>
          <input
            onInput={(e) => setSubCategory(e.target.value)}
            type="text"
            id="subcategory"
            value={subCategory}
          />
        </div>
        <div className="add-form-item flex gap-1 add-form-btn-container">
          {['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'].map((item, index) => {
            return (
              <button
                onClick={() => handleClick(item)}
                key={index}
                type="button"
                className={sizes.includes(item) ? 'active' : ''}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="add-form-item flex gap-05">
          <label htmlFor="bestseller">Add To Bestseller</label>
          <input
            className="checkbox"
            onChange={(e) => setBestSeller(e.target.checked)}
            type="checkbox"
            id="bestseller"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="add-product-submit-btn"
        >
          {loading ? 'Uploading...' : 'Add Product'}
        </button>
      </form>
    </>
  );
}

export default Add;
