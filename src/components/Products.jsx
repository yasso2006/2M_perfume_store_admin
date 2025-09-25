import { useEffect } from "react";
import React, { useState, useMemo } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  async function addProducts() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    addProducts();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("add"); // 'add' | 'update'
  const [editingIndex, setEditingIndex] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [loading, setLoading] = useState(false);

  const openAdd = () => {
    setMode("add");
    setName("");
    setDesc("");
    setPrice("");
    setImage1(null);
    setImage2(null);
    setImage3(null);
    setEditingIndex(null);
    setIsOpen(true);
  };

  const openUpdate = (index, id) => {
    const p = products[index];
    setMode("update");
    setName(p.name);
    setDesc(p.descreption);
    setPrice(p.price);
    setImage1(p.image1);
    setImage2(p.image2);
    setImage3(p.image3);
    setEditingIndex(id);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: name.trim(),
      price: Number(price) || 0,
      description: desc.trim(),
    };

    if (mode === "add") {
      try {
        const upload = await handleUpload();
        await axios.post(`${import.meta.env.VITE_API_URL}/add`, {
          name: name.trim(),
          price: Number(price) || 0,
          description: desc.trim(),
          img1: upload.img1,
          img2: upload.img2,
          img3: upload.img3,
        });
        addProducts(); // Refresh products list
      } catch (err) {
        console.log(err);
      }
    } else if (mode === "update" && editingIndex !== null) {
      try {
        const upload = await handleUpload();
        await axios.post(`${import.meta.env.VITE_API_URL}/update`, {
          name: name.trim(),
          price: Number(price) || 0,
          description: desc.trim(),
          img1: upload.img1,
          img2: upload.img2,
          img3: upload.img3,
          id: editingIndex,
        });
        addProducts(); // Refresh products list
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
    closeModal();
  };

  const onDelete = async (id) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/delete/product`, {
        id: id,
      });
      addProducts();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (image1 instanceof File) formData.append("img1", image1);
    if (image2 instanceof File) formData.append("img2", image2);
    if (image3 instanceof File) formData.append("img3", image3);

    // If no files to upload, return current string values as-is
    if ([image1, image2, image3].every((img) => !(img instanceof File))) {
      return {
        img1: typeof image1 === "string" ? image1 : null,
        img2: typeof image2 === "string" ? image2 : null,
        img3: typeof image3 === "string" ? image3 : null,
      };
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData);
      return res.data; // { img1, img2, img3 }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="products">
      <div className="products__header">
        <h2>Products</h2>
        <button className="btn btn--primary" onClick={openAdd}>
          Add Product
        </button>
      </div>

      <div className="products__grid">
        {products.map((product, index) => (
          <div className="product__card" key={index}>
            <div className="product__image">
              <img src={product.image1} alt={product.name} />
            </div>
            <div className="product__content">
              <h3 className="product__title">{product.name}</h3>
              <p className="product__description">{product.descreption}</p>
              <p className="product__price">{product.price} L.E</p>
            </div>
            <div className="btn__actions">
              <button
                className="btn"
                onClick={() => openUpdate(index, product.id)}
              >
                Update
              </button>
              <button
                className="btn btn--delete"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="modal__overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3>{mode === "add" ? "Add Product" : "Update Product"}</h3>
              <button className="modal__close" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form className="modal__form" onSubmit={onSubmit}>
              <label>
                <span>Name</span>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Product name"
                  required
                />
              </label>
              <label>
                <span>Price</span>
                <input
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                  placeholder="0"
                  required
                />
              </label>
              <label>
                <span>Description</span>
                <textarea
                  name="description"
                  value={desc}
                  onChange={(e) => {
                    setDesc(e.target.value);
                  }}
                  placeholder="Short description"
                  rows="3"
                />
              </label>

              <label>
                <span>Image 1</span>
                <input
                  type="file"
                  name="image1"
                  onChange={(e) => {
                    setImage1(e.target.files[0]);
                  }}
                  required
                />
              </label>
              <label>
                <span>Image 2</span>
                <input
                  type="file"
                  name="image2"
                  onChange={(e) => {
                    setImage2(e.target.files[0]);
                  }}
                />
              </label>
              <label>
                <span>Image 3</span>
                <input
                  type="file"
                  name="image3"
                  onChange={(e) => {
                    setImage3(e.target.files[0]);
                  }}
                />
              </label>

              <div className="modal__actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  {loading ? "Loading" : mode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
