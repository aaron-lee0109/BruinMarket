import React, { useState } from "react";
import { CategoryItems } from "./CategoryItems";
import { Link } from "react-router-dom";

export const Dropdown = () => {

    const [dropdown, setDropdown] = useState(false);

    return (
        <>
            <ul className={dropdown ? "categories-submenu clicked" : "categories-submenu"} onClick={() => setDropdown(!dropdown)}>
                {CategoryItems.map((item) => {
                    return (
                        <li key={item.id}>
                            <Link to={`/category${item.path}`} className={item.cName} onClick={() => setDropdown(false)}>
                                {item.title}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </>
    );
}