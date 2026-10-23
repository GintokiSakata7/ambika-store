"use client";

import React from "react";
import { useStore } from "../context/StoreContext";
import { CategoryIconRenderer } from "./Icons";

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
          <CategoryIconRenderer categoryId={cat.id} size={15} />
          <span>{cat.label}</span>
        </button>
      ))}
    </nav>
  );
}
