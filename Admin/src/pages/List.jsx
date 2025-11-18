import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/Admincontext.jsx';
import { toast } from 'react-toastify';
import './List.css';

function List() {
  const { backend } = useContext(AdminContext);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all products
  async function fetchProducts() {
    try {
      const res = await axios.get(backend + '/api/product/list');
      setProducts(res.data?.allProducts);
      toast.success(res.data?.message);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          'Something Went Wrong. Please Try Again Later'
      );
    }
  }

  // Delete product
  async function deleteProduct(id) {
    try {
      const res = await axios.delete(backend + '/api/product/remove', {
        data: { id },
      });
      toast.success(res.data?.message);
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message ||
          'Something Went Wrong. Please Try Again Later'
      );
    }
  }

  // Handle edit click
  function startEditing(product) {
    setEditingProduct({
      ...product,
      sizes: Array.isArray(product.sizes)
        ? product.sizes
        : JSON.parse(product.sizes || '[]'),
    });
  }

  // Update product
  async function handleUpdateProduct() {
    try {
      const formData = new FormData();
      formData.append('id', editingProduct._id);
      formData.append('name', editingProduct.name);
      formData.append('desc', editingProduct.desc);
      formData.append('price', editingProduct.price);
      formData.append('category', editingProduct.category);
      formData.append('subCategory', editingProduct.subCategory);
      formData.append('sizes', JSON.stringify(editingProduct.sizes || []));
      formData.append('bestseller', editingProduct.bestseller);

      const res = await axios.post(backend + '/api/product/update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || 'Something went wrong updating product'
      );
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <div>
        <div className="product-table-header">
          <p>Product</p>
          <p>Name</p>
          <p>Prices</p>
          <p>Sizes</p>
          <p>Actions</p>
        </div>

        {products.map((item, index) => (
          <div key={index} className="product-table-row">
            <div className="product-img-container">
              <img src={item.image[0]} alt={item.name} />
            </div>
            <p className="name">{item.name}</p>
            <p className="price">GH₵{item.price}</p>
            <p className="sizes">{item.sizes?.join(', ')}</p>
            <div className="actions flex gap-05">
              <button
                onClick={() => deleteProduct(item._id)}
                className="delete-product-btn"
              >
                X
              </button>
              <button
                onClick={() => startEditing(item)}
                className="Edit-product-btn"
              >
                EDIT
              </button>
            </div>
          </div>
        ))}

        {editingProduct && (
          <div className="edit-form">
            <h3>Edit Product</h3>

            <label>
              Name:
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Description:
              <textarea
                value={editingProduct.desc}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    desc: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
              />
            </label>

            <div>
              <label>Sizes (comma-separated):</label>
              <input
                type="text"
                value={(editingProduct.sizes || []).join(', ')}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    sizes: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                placeholder="e.g. S, M, L"
              />
            </div>

            <label>
              Category:
              <input
                type="text"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Sub Category:
              <input
                type="text"
                value={editingProduct.subCategory}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    subCategory: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Bestseller:
              <select
                value={editingProduct.bestseller ? 'true' : 'false'}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    bestseller: e.target.value === 'true',
                  })
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </label>

            <div className="edit-btn-container">
              <button onClick={handleUpdateProduct}>Save Changes</button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default List;
