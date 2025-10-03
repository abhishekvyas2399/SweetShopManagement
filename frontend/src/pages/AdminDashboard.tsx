import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {addSweet,fetchSweets,searchSweets,updateSweet,deleteSweet,restockSweet} from "../redux/slice/sweetSlice";
import type {ReduxStoreType,ReduxDispatchType} from "../redux/store";
import { useNavigate } from "react-router-dom";
import { addCategory, deleteCategory, fetchCategory } from "../redux/slice/categorySlice";

export default function AdminDashboard() {
  const dispatch = useDispatch<ReduxDispatchType>();
  const { items, loading } = useSelector((state:ReduxStoreType) => state.sweets);

  const [form, setForm] = useState({ name: "", categoryId:0, price: 0 });
  const [editId, setEditId] = useState<any>(null);
  const [search, setSearch] = useState({ name: "", categoryId: 0, price: 0 });
  const [restockSweetData,setRestockSweetData]=useState<any>(null);
  const [restockSweetQuantity,setRestockSweetQuantity]=useState<number>(0);

  const categorys=useSelector((state:ReduxStoreType)=>state.categorys.items);
  const [categoryName,setCategoryName]= useState("");

  const navigate=useNavigate();
  const userInfo=useSelector((state:ReduxStoreType)=>state.userData.userInfo);
  const token = userInfo?.token;
  const error=useSelector((state:ReduxStoreType)=>state.sweets.error);
  const categoryError=useSelector((state:ReduxStoreType)=>state.categorys.error);
  useEffect(()=>{
    if(!token) return; // prevent navigation till userInfo not load
      if(userInfo?.user?.role==="CUSTOMER")    navigate("/user-dashboard");
      else if(userInfo?.user?.role==="ADMIN")    navigate("/admin-dashboard");
  },[userInfo,userInfo,token,navigate])

  useEffect(() => {
    if(token){
      dispatch(fetchSweets(token));
      dispatch(fetchCategory(token));
    }
  }, [dispatch,token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      dispatch(updateSweet({ id: editId, data: form ,token}));
      setEditId(null);
    } else {
      console.log(form);
      dispatch(addSweet({sweet:form,token}));
    }
    setForm({ name: "", categoryId: 0, price: 0 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchSweets({query:search,token}));
  };

  const addCategorySubmit=(e:React.FormEvent)=>{
    e.preventDefault();
    if(categoryName.length<4){
      alert("category must have atleast 4 character");
      return;
    }
    dispatch(addCategory({name:categoryName,token}));
  }

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Sweet Shop Admin Dashboard</h1>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
        onClick={()=>{localStorage.removeItem('authorization');location.reload()}}> Logout </button>
      </div>

      <div className="container mx-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 
            zxl:gap-2 gap-4">
              
            <div className="w-full flex flex-col items-center justify-centerfont-bold">

            {/* add category */}
            <form onSubmit={addCategorySubmit} className="bg-white p-3 rounded-lg shadow-md">
              <div className="flex flex-wrap">
                <input  type="text"  id="categoryName"  placeholder="Enter category name"  value={categoryName}  
                onChange={(e) => setCategoryName(e.target.value)} className="m-2 block w- p-2 border border-gray-300 
                rounded-md shadow-sm focus:ring-[#b95b45] focus:border-[#b95b45] focus:outline-none" />
                <button  type="submit"  className="bg-[#b95b45] hover:bg-[#a34b38] text-white px-5 py-2 rounded-md 
                transition-colors duration-200">  Add Category  </button>
              </div>
            </form>
            {/* category error */}
            {categoryError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-4">
                <strong className="font-semibold">Category Error:</strong> {categoryError}
              </div>
            )}

              {/* category */}
              <div className="overflow-auto max-h-90 w-full p-4 m-4 bg-white rounded shadow">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b">Name</th>
                      <th className="p-3 border-b">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorys.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{category.name}</td>
                        <td className="p-3 border-b">
                          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                            onClick={() =>category.id && dispatch(deleteCategory({ id: category.id, token }))}>Delete 
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          <div className="w-full overflow-auto flex flex-col items-center justify-centerfont-bold">

            {/* Add / Edit Sweet */}
            <form onSubmit={handleSubmit} className=" space-x-2 m-4 flex flex-col items-center rounded-lg shadow-md">
              <input type="text"  placeholder="Name"  value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}  className="border p-2 rounded m-2"/>
              {/* <input  type="text"  placeholder="Category"  value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}  className="border p-2 rounded m-2"/> */}
                  <select  value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })} 
                  className="border p-2 rounded m-2">
                    <option value="" >Select Category</option>
                    {categorys.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
              <input  type="text"  placeholder="Price"  value={form.price==0 || isNaN(form.price)?"":form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}  className="border p-2 rounded m-2"/>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 m-2 rounded">
                {editId ? "Update sweet" : "Add sweet"}
              </button>
              {editId && <span className="bg-blue-500 text-white px-4 py-2 rounded m-2" 
              onClick={()=>{setEditId(null);setForm({ name: "", categoryId: 0, price: 0 })}}>stop edit</span> }
            </form>


            {/* sweet add,edit,delete error */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4">
                <strong className="font-semibold">Sweets Error:</strong> {error}
              </div>
            )}


            {/* restock sweet */}
            <div className="flex flex-col items-center">
              {restockSweetData?.name && <div className="p-0.5 m-0.5">{restockSweetData.name} Restock</div>}
              <div  className="shadow-lg p-2 flex justify-around" >
                {restockSweetData?.quantity && <div className="p-0.5 m-0.5">{restockSweetData.quantity} </div>}
                <span className="p-0.5 m-0.5" > + </span>
                <input type="number" name="qunatity" className="w-20 mx-2 border border-black rounded-sm"
                onChange={(e)=>{setRestockSweetQuantity(Number(e.target.value))}}
                value={restockSweetQuantity==0 || isNaN(restockSweetQuantity)?"":restockSweetQuantity}/>
                <button className="bg-yellow-500 text-white px-1 py-1 rounded"
                onClick={()=>{
                  restockSweetData?.id && dispatch(restockSweet({id:restockSweetData.id,quantity:restockSweetQuantity,token}))
                  setRestockSweetData(null);
                  setRestockSweetQuantity(0);
                }}>Restock</button>
              </div>
            </div>

          </div>

          <div className="w-full h-130 overflow-auto bg-white border border-gray-300 flex flex-col items-center  font-bold 
          md:col-span-3 lg:col-span-3 xl:col-span-3">

              {/* Search */}
              <form onSubmit={handleSearch} className="m-4 space-x-2">
                <input  type="text"  placeholder="Search Name"  value={search.name || ""}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}  className="border p-2 rounded"/>
                {/* <input  type="text"  placeholder="Search Category"  value={search.categoryId || ""}
                onChange={(e) => setSearch({ ...search, categoryId: Number(e.target.value) })}  className="border p-2 rounded"/> */}
                  <select  value={search.categoryId || ""} onChange={(e) => setSearch({ ...search, categoryId: Number(e.target.value) })} 
                  className="border p-2 rounded m-2">
                    <option value="" >Select Category</option>
                    {categorys.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                  </select>
                <input  type="text"  placeholder="Search Price" value={search.price==0 || isNaN(search.price)?"":search.price}
                onChange={(e) => setSearch({ ...search, price: Number(e.target.value) })}  className="border p-2 rounded"/>
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Search</button>
              </form>
              <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 mr-4" 
                onClick={()=>token && dispatch(fetchSweets(token))}>click here to see all sweets...</button>
                {/* Table */}
                {loading && <p>Loading...</p>}
                <table className="border-collapse border w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Category</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">quantity</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(items) && items?.map((sweet) => (
                      <tr key={sweet.id}>
                        <td className="border p-2">{sweet.name}</td>
                        <td className="border p-2">{sweet.category.name}</td>
                        <td className="border p-2">{sweet.price}</td>
                        <td className="border p-2 flex justify-around">
                          <div className="p-0.5 m-0.5">{sweet.quantity} </div>
                          <button className="bg-yellow-500 text-white px-1 py-1 rounded"
                          onClick={()=>{setRestockSweetData(sweet);setRestockSweetQuantity(0)}}>Restock</button>
                        </td>
                        <td className="border p-2 space-x-2">
                          <button className="bg-yellow-500 text-white px-2 py-1 rounded"
                            onClick={() => { setForm(sweet); setEditId(sweet.id);}}>Edit</button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => sweet.id && dispatch(deleteSweet({id:sweet.id,token}))}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center p-2">
                          No sweets found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

          </div>
        </div>
      </div>
    </div>
  );
}