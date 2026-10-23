"use client";

import React from "react";

export default function ProductSkeletonCard() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      <div className="product-media-wrapper skeleton-box" style={{ aspectRatio: "1 / 1", width: "100%" }}>
        <div className="skeleton-shimmer"></div>
      </div>

      <div className="product-body" style={{ padding: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div className="skeleton-box" style={{ width: "40%", height: "14px", borderRadius: "4px" }}>
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-box" style={{ width: "25%", height: "14px", borderRadius: "4px" }}>
            <div className="skeleton-shimmer"></div>
          </div>
        </div>

        <div className="skeleton-box" style={{ width: "85%", height: "18px", borderRadius: "4px", marginBottom: "6px" }}>
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="skeleton-box" style={{ width: "60%", height: "18px", borderRadius: "4px", marginBottom: "14px" }}>
          <div className="skeleton-shimmer"></div>
        </div>

        <div className="skeleton-box" style={{ width: "70%", height: "14px", borderRadius: "4px", marginBottom: "16px" }}>
          <div className="skeleton-shimmer"></div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
          <div className="skeleton-box" style={{ width: "35%", height: "22px", borderRadius: "4px" }}>
            <div className="skeleton-shimmer"></div>
          </div>
          <div className="skeleton-box" style={{ width: "38%", height: "32px", borderRadius: "6px" }}>
            <div className="skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </article>
  );
}
