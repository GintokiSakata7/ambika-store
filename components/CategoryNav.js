"use client";

import React from "react";

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "phenyl", label: "🧴 Phenol & Floor Wash" },
  { id: "acids", label: "🚽 Acids & Toilet Cleaners" },
  { id: "naphthalene", label: "⚪ Naphthalene Balls" },
  { id: "powders", label: "🧼 Bleach & Powders" },
  { id: "brooms", label: "🧹 Brooms, Mops & Wipers" },
  { id: "accessories", label: "🪣 Scrubbers & Buckets" }
];

export default function CategoryNav({ activeCategory, onSelectCategory }) {
  return (
    <nav className="category-filter-nav" aria-label="Product categories">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          className={`cat-chip ${activeCategory === cat.id ? "active" : ""}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </nav>
  );
}
