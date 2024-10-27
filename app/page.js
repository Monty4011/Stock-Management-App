"use client"
import Header from "@/components/Header";
import { useState, useEffect, act } from "react";

export default function Home() {

  const [productform, setProductform] = useState({})
  const [products, setproducts] = useState([])
  const [alert, setalert] = useState("")
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false)
  const [dropdown, setdropdown] = useState([])

  const addProduct = async (e) => {
    
    e.preventDefault();
    try {
      const response = await fetch('api/product', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productform),
      });

      if (response.ok) {
        console.log("Product added successfully")
        setalert("Your product has been added successfully")
        setProductform({})
      }
      else {
        console.log("Error adding product")
      }
    }
    catch (error) {
      console.log("Error:", error);
    }

    const response = await fetch('api/product')
      let rjson = await response.json()
      setproducts(rjson.products)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('api/product')
      let rjson = await response.json()
      setproducts(rjson.products)
    }
    fetchProducts()
  }, [])

  const handleChange = (e) => {
    setProductform({ ...productform, [e.target.name]: e.target.value })
  }

  const ondropdownchange = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 2) {
      setLoading(true)
      setdropdown([])
      const response = await fetch('api/search?query=' + query)
      let rjson = await response.json()
      setdropdown(rjson.products)
      setLoading(false)
    }
    else{
      setdropdown([])
    }
  }

  const buttonAction = async (action, name, initialQuantity) => {

    let index = products.findIndex((item) => item.name == name)

    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {

      newProducts[index].quantity = parseInt(initialQuantity) + 1
    }
    else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setproducts(newProducts)

    let indexDrop = dropdown.findIndex((item) => item.name == name)

    let newDropdown = JSON.parse(JSON.stringify(products))
    if (action == "plus") {

      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1
    }
    else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1
    }
    setdropdown(newDropdown)

    console.log(action, name, initialQuantity)
    setLoadingaction(true)
    const response = await fetch('api/action', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, name, initialQuantity }),
    });
    let r = await response.json()
    console.log(r)
    setLoadingaction(false)
  }



  return (
    <>
      <Header />
      <div className=" w-[80%] mx-auto  p-4 rounded-lg my-5">
        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-bold my-4">Search a Product</h1>
        <div className="mb-8">
          <label htmlFor="searchProduct" className="block mb-2">Search:</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="searchProduct"
              name="searchProduct"
              className="w-full p-2 border border-gray-400 rounded mb-2 "
              onChange={ondropdownchange}
            // onBlur={()=>{setdropdown([])}}
            />
            <select id="searchDropdown" className=" p-2 border h-10 border-gray-400 rounded">
              <option value="All">All</option>
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </select>
          </div>

          {loading && <svg width="100" height="100" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" stroke="#000" strokeWidth="5" fill="none" />
            <circle cx="25" cy="5" r="3.5" fill="#000">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 25 25"
                to="360 25 25"
                dur="1s"
                repeatCount="indefinite" />
            </circle>
          </svg>
          }

          <div className="dropdowncontainer">
            {dropdown.map(item => {
              return <div key={item.name} className="container my-3 p-2 flex justify-between bg-purple-200">
                <span className="price">{item.name} ({item.quantity} available for Rs.{item.price} )</span>
                <div className="flex gap-4 items-center">
                  <button disabled={loadingaction} onClick={() => { buttonAction("minus", item.name, item.quantity) }} className="add px-4 py-1 bg-purple-400 rounded-xl ">-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button disabled={loadingaction} onClick={() => { buttonAction("plus", item.name, item.quantity) }} className="subtract px-4 py-1 bg-purple-400 rounded-xl ">+</button>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>
      <div className=" w-[80%] mx-auto  p-4 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Add a Product</h1>
        <form className="mb-8">
          <div className="mb-4">
            <label htmlFor="productName" className="block mb-2">Product Name:</label>
            <input
              onChange={handleChange}
              type="text"
              id="productName"
              name="name"
              className="w-full p-2 border border-gray-400 rounded"
              required
              value={productform?.name || ""}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productPrice" className="block mb-2">Price:</label>
            <input
              onChange={handleChange}
              type="text"
              id="productPrice"
              name="price"
              className="w-full p-2 border border-gray-400 rounded"
              required
              value={productform?.price || ""}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="productQuantity" className="block mb-2">Quantity:</label>
            <input
              onChange={handleChange}
              type="number"
              id="productQuantity"
              name="quantity"
              className="w-full p-2 border border-gray-400 rounded"
              required
              value={productform?.quantity || ""}
            />
          </div>
          <button
            onClick={addProduct}
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>
      <div className=" w-[80%] mx-auto  p-4 my-5 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Display Current Stock</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-extrabold ">Product Name</th>
              <th className="py-2 px-4 border-b font-extrabold ">Price</th>
              <th className="py-2 px-4 border-b font-extrabold ">Quantity</th>
            </tr>
          </thead>
          {<tbody>
            {products && products.map(product => {
              return <tr key={product.name}>
                <td className="py-2 px-4 border-b">{product.name}</td>
                <td className="py-2 px-4 border-b">Rs.{product.price}</td>
                <td className="py-2 px-4 border-b">{product.quantity}</td>
              </tr>
            })}
          </tbody>}
        </table>
      </div>
    </>
  );
}

