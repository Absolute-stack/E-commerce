import { useState } from 'react';
import { createContext } from 'react';

export const AdminContext = createContext();

function AdminContextProvider(props) {
  const [token, setToken] = useState(false);
  const backend = import.meta.env.VITE_BACKEND_URL;
  const value = {
    token,
    setToken,
    backend,
  };

  return (
    <>
      <AdminContext.Provider value={value}>
        {props.children}
      </AdminContext.Provider>
    </>
  );
}

export default AdminContextProvider;
