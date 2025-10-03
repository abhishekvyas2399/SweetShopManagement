import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSweets, purchaseSweet, searchSweets } from "../redux/slice/sweetSlice";
import type { ReduxStoreType, ReduxDispatchType } from "../redux/store";
import { fetchCategory } from "../redux/slice/categorySlice";

export default function UserDashboard() {
  const dispatch = useDispatch<ReduxDispatchType>();
  const { items, loading } = useSelector((state: ReduxStoreType) => state.sweets);
  const token = useSelector((state: ReduxStoreType) => state.userData.userInfo?.token);

  // Store quantity for each sweet
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  // search sweet form
  const [search, setSearch] = useState({ name: "", categoryId: 0, price: 0 });
  const categorys=useSelector((state:ReduxStoreType)=>state.categorys.items);

  useEffect(() => {
    if(token){
      dispatch(fetchSweets(token));
      dispatch(fetchCategory(token));
    }
  }, [dispatch,token]);

  const handleQuantityChange = (id: number, value: string) => {
    const quantity = Math.max(0, Number(value)); // prevent negative values
    setQuantities((prev) => ({ ...prev, [id]: quantity }));
  };

  const handlePurchase = (sweetId: number) => {
    const quantity = quantities[sweetId] || 0;
    if (token && quantity > 0) {
      dispatch(purchaseSweet({ id: sweetId, quantity, token }));
      setQuantities((prev) => ({ ...prev, [sweetId]: 0 })); // reset after purchase
    }
  };


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(searchSweets({query:search,token}));
  };


  return (
    <div className="p-6 overflow-x-auto">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4"> Purchase Sweets</h1>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 h-8 w-19 rounded"
        onClick={()=>{localStorage.removeItem('authorization');location.reload()}}> Logout </button>
      </div>

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

      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <table className="border-collapse border w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Available</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((sweet:any) => {
              const quantity = quantities[sweet.id] || 0;
              const canPurchase = quantity > 0 && sweet.quantity >= quantity;

              return (
                <tr key={sweet.id}>
                  <td className="border p-2">{sweet.name}</td>
                  <td className="border p-2">{sweet.category.name}</td>
                  <td className="border p-2">{sweet.price}</td>
                  <td className="border p-2">{sweet.quantity}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      min="1"
                      value={quantity==0 || isNaN(quantity)?"":quantity}
                      onChange={(e) => handleQuantityChange(sweet.id, e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1"
                      disabled={sweet.quantity === 0}
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handlePurchase(sweet.id)}
                      disabled={!canPurchase}
                      className={`px-4 py-1 rounded ${
                        canPurchase
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Purchase
                    </button>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-2">
                  No sweets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
