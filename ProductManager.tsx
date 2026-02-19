import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface ProductManagerProps {
  session: any;
  onUpdate: () => void;
}

export function ProductManager({ session, onUpdate }: ProductManagerProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: 'crop',
    name: '',
    quantity: '',
    unit: 'kg',
    category: '',
    notes: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/products`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Load products error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        // Update product
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/products/${editingProduct.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(formData)
          }
        );

        if (response.ok) {
          await loadProducts();
          onUpdate();
          resetForm();
        }
      } else {
        // Create product
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/products`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify(formData)
          }
        );

        if (response.ok) {
          await loadProducts();
          onUpdate();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Save product error:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/products/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      if (response.ok) {
        await loadProducts();
        onUpdate();
      }
    } catch (error) {
      console.error('Delete product error:', error);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      type: product.type,
      name: product.name,
      quantity: product.quantity,
      unit: product.unit,
      category: product.category,
      notes: product.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'crop',
      name: '',
      quantity: '',
      unit: 'kg',
      category: '',
      notes: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const cropCategories = ['Grains', 'Vegetables', 'Fruits', 'Legumes', 'Root Crops', 'Other'];
  const livestockCategories = ['Cattle', 'Goats', 'Sheep', 'Poultry', 'Pigs', 'Other'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-gray-900">My Products & Livestock</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, category: '' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="crop">Crop</option>
                  <option value="livestock">Livestock</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select category...</option>
                  {(formData.type === 'crop' ? cropCategories : livestockCategories).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                {formData.type === 'crop' ? 'Crop Name' : 'Livestock Type'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={formData.type === 'crop' ? 'e.g., Wheat, Maize, Tomatoes' : 'e.g., Dairy Cow, Chicken'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  {formData.type === 'crop' ? (
                    <>
                      <option value="kg">Kilograms (kg)</option>
                      <option value="tons">Tons</option>
                      <option value="bags">Bags</option>
                      <option value="units">Units</option>
                    </>
                  ) : (
                    <>
                      <option value="heads">Heads</option>
                      <option value="units">Units</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any additional information..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="grid md:grid-cols-2 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    product.type === 'livestock' ? 'bg-orange-100' : 'bg-green-100'
                  }`}>
                    <span className="text-2xl">
                      {product.type === 'livestock' ? '🐄' : '🌾'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-gray-900">{product.name}</h4>
                    <p className="text-gray-600 text-sm">{product.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="text-gray-900">{product.quantity} {product.unit}</span>
                </div>
                {product.notes && (
                  <div className="text-sm">
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-700 mt-1">{product.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 mb-4">No products added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
