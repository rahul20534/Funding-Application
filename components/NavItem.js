import Link from "next/link";

export default function NavItem({item, path}) {
  return (
    <li className="nav-item category "   key={item.id}>
      {/* //add hover effect to the nav item */}
      <Link href={`/${path}/${item.id}`} className="nav-link"  >
        <span classname="obj" style={{fontSize: "1.5rem", fontWeight: "bold", color
    :"#1d0246", fontStyle: "oblique", }} >{item.name}</span>
      </Link>
    </li>
  );
}
