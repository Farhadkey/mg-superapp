import type { StoreItem } from "../../types";

interface ProductCardProps {
  item: StoreItem;
  onAddToCart?: (item: StoreItem) => void;
  onClick?: () => void;
}

export default function ProductCard({ item, onAddToCart, onClick }: ProductCardProps) {
  const outOfStock = item.inStock === false;

  return (
    <div className={`ui-product-card ${outOfStock ? "ui-product-card--oos" : ""}`} onClick={onClick}>
      <div className="ui-product-card-icon">{item.icon}</div>
      <div className="ui-product-card-info">
        <h4 className="ui-product-card-name">{item.name}</h4>
        <p className="ui-product-card-desc">{item.description}</p>
        <div className="ui-product-card-meta">
          {item.price && <span className="ui-product-card-price">{item.price}</span>}
          <span className="ui-product-card-cat">{item.category}</span>
        </div>
      </div>
      <div className="ui-product-card-action">
        {outOfStock ? (
          <span className="ui-product-card-oos-tag">Out of stock</span>
        ) : (
          <button
            className="ui-product-card-add"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(item);
            }}
            aria-label={`Add ${item.name} to cart`}
          >
            + Add
          </button>
        )}
      </div>
    </div>
  );
}
