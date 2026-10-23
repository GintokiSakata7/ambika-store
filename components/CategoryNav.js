"use client";

import React from "react";
import { useStore } from "../context/StoreContext";

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  const { categories } = useStore();

  return (
    <nav className="category-filter-nav" aria-label="Product categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`cat-chip ${activeCategory === cat.id ? "active" : ""}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.icon && <span style={{ marginRight: "6px" }}>{cat.icon}</span>}
          <span>{cat.label}</span>
        </button>
      ))}
    </nav>
  );
}
