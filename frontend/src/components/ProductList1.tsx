import { useEffect, useState } from 'react';

// This is a plain, simple item list. No Redux, no hidden tricks.
export default function ProductList1() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    // We are forcing one item to exist so your screen isn't blank!
    setItems([
      {
        _id: "1",
        title: "Test iPhone 13",
        price: 45000,
        category: "Electronics",
        description: "This is a local test product to make sure our frontend grid works!",
        imageUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400"
      }
    ]);
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Fresh Recommendations</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {items.map((product) => (
          <div key={product._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>₹ {product.price}</h3>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}