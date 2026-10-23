import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

interface MarketplacePageProps {
  searchQuery: string;
  isCreateModalOpen: boolean;
  onCloseCreateModal: () => void;
  user: any;
  userData: any;
  onInitiateChat?: (sellerId: string, sellerName: string, sellerAvatar?: string) => void;
}

const CATEGORIES = ['All Items', 'Textbooks', 'Dorm Essentials', 'Tutoring Services', 'Electronics'];

export const MarketplacePage: React.FC<MarketplacePageProps> = ({
  searchQuery,
  isCreateModalOpen,
  onCloseCreateModal,
  user,
  userData,
  onInitiateChat,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // New Listing Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('Textbooks');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Real-time sync with Firestore 'products' collection
  useEffect(() => {
    try {
      const q = query(collection(firestore, 'products'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }));
          setProducts(fetched);
          setLoading(false);
        },
        (err) => {
          console.warn('[Marketplace] Firestore snapshot error:', err);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('[Marketplace] Error listening to products:', e);
      setLoading(false);
    }
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      alert('Please fill out the title and price.');
      return;
    }

    try {
      setSubmitting(true);
      const sellerName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Student';
      const sellerAvatar = userData?.photoUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${sellerName}`;

      await addDoc(collection(firestore, 'products'), {
        title: newTitle.trim(),
        price: newPrice.startsWith('₹') ? newPrice : `₹${newPrice.trim()}`,
        category: newCategory,
        description: newDescription.trim(),
        image: newImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
        sellerId: user.uid,
        sellerName,
        sellerAvatar,
        createdAt: serverTimestamp(),
      });

      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setNewImage('');
      onCloseCreateModal();
      alert('🎉 Your listing is live on the Campus Marketplace!');
    } catch (err: any) {
      console.error('Failed to create listing:', err);
      alert('Error creating listing: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Items' || item.category === selectedCategory;
    const titleMatch = (item.title || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const descMatch = (item.description || '')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && (titleMatch || descMatch);
  });

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Category Pills & Top Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: 'var(--bg-card)',
        padding: '16px 24px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? 'var(--primary)' : 'var(--bg-main)',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Count Indicator */}
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>
          {filteredProducts.length} verified listings found
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading marketplace items...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '60px 24px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛍️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            No items listed in this category yet
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            Have a textbook, dorm furniture, electronics, or tutoring service to offer? Click the button above to create a listing!
          </p>
        </div>
      ) : (
        /* Products Grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              {/* Product Image */}
              <div style={{
                width: '100%',
                height: '190px',
                backgroundColor: '#e2e8f0',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600'}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {product.category || 'General'}
                </span>
              </div>

              {/* Product Body */}
              <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: 'var(--primary)',
                  marginBottom: '6px',
                }}>
                  {product.price}
                </div>
                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  marginBottom: '8px',
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {product.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  marginBottom: '16px',
                  flex: 1,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                }}>
                  {product.description}
                </p>

                {/* Seller details */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={product.sellerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${product.sellerName || 'User'}`}
                      alt="Seller"
                      style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                      {product.sellerName || 'Student'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-light)', fontWeight: 500 }}>
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={() => setSelectedProduct(null)}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ position: 'relative', width: '100%', height: '300px', backgroundColor: '#e2e8f0' }}>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '28px 32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary">{selectedProduct.category}</span>
                <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary)' }}>
                  {selectedProduct.price}
                </span>
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>
                {selectedProduct.title}
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                {selectedProduct.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--bg-main)',
                padding: '16px 20px',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={selectedProduct.sellerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedProduct.sellerName || 'User'}`}
                    alt={selectedProduct.sellerName}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {selectedProduct.sellerName}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Campus Verified Student
                    </div>
                  </div>
                </div>

                {selectedProduct.sellerId !== user.uid && onInitiateChat && (
                  <button
                    onClick={() => {
                      onInitiateChat(selectedProduct.sellerId, selectedProduct.sellerName, selectedProduct.sellerAvatar);
                      setSelectedProduct(null);
                    }}
                    className="btn btn-primary"
                  >
                    💬 Message Seller
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }} onClick={onCloseCreateModal}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>
                Create Campus Listing
              </h3>
              <button
                onClick={onCloseCreateModal}
                style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Item Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic Chemistry Textbook (4th ed)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    height: '42px',
                    padding: '0 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'var(--bg-main)',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Price (₹) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 800"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      padding: '0 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'var(--bg-main)',
                    }}
                  >
                    {CATEGORIES.filter((c) => c !== 'All Items').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Photo (Select File)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                  }}
                />
                {newImage && (
                  <div style={{ marginTop: '8px', width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                    <img src={newImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Description & Pickup Details
                </label>
                <textarea
                  placeholder="Describe condition, pickup spot on campus, negotiable or fixed..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: 'var(--bg-main)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={onCloseCreateModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
