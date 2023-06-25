import React from "react";
import NavItem from "./NavItem";

export default function NavBar({ items, path }) {
  return (
    <ul
      className="category nav nav-pills d-flex flex-column align-items-start min-vh-100"
      id="menu" style={{background: "#9393e3"}}
    >
      {items.map(item => <NavItem key={item.id} item={item} path={path} /> )}
    </ul>
  );
}
