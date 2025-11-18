import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assest';
import './Sidebar.css';

function Sidebar() {
  return (
    <>
      <aside className="sidebar">
        <NavLink to="/add" className="add-section flex gap-05 sidebar-item">
          <img src={assets.add_icon} alt="" />
          <p>Add</p>
        </NavLink>
        <NavLink to="/list" className="list-section flex gap-05 sidebar-item">
          <img src={assets.order_icon} alt="" />
          <p>List</p>
        </NavLink>
        <NavLink
          to="/orders"
          className="order-section flex gap-05 sidebar-item"
        >
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
      </aside>
    </>
  );
}

export default Sidebar;
