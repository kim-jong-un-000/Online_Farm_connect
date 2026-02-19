import { useState, useEffect } from 'react';
import { MapPin, Search, Star, Filter, Eye, Award, Plus, X } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface MarketplaceDashboardProps {
  session: any;
  profile: any;
}

export function MarketplaceDashboard({ session, profile }: MarketplaceDashboardProps) {
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [showCreateListing, setShowCreateListing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🌍' },
    { id: 'grains', name: 'Grains & Cereals', icon: '🌾' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'livestock', name: 'Livestock', icon: '🐄' },
    { id: 'dairy', name: 'Dairy Products', icon: '🥛' },
    { id: 'organic', name: 'Organic', icon: '🌱' }
  ];

  useEffect(() => {
    loadListings();
    loadMyProducts();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, searchLocation, selectedCategory, sortBy]);

  const loadListings = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/marketplace/listings`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setListings(data.listings || []);
      }
    } catch (error) {
      console.error('Load listings error:', error);
    }
  };

  const loadMyProducts = async () => {
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
        setMyProducts(data.products || []);
      }
    } catch (error) {
      console.error('Load products error:', error);
    }
  };

  const filterAndSortListings = () => {
    let filtered = [...listings];

    // Search by name/description
    if (searchQuery) {
      filtered = filtered.filter(listing =>
        listing.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.farmerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by location
    if (searchLocation) {
      filtered = filtered.filter(listing =>
        listing.farmerLocation?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing =>
        listing.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();

    const product = myProducts.find(p => p.id === selectedProduct);
    if (!product) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/marketplace/listings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            productId: selectedProduct,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            unit: product.unit,
            description,
            location: profile?.location || '',
            category: product.category
          })
        }
      );

      if (response.ok) {
        setShowCreateListing(false);
        setSelectedProduct('');
        setPrice('');
        setQuantity('');
        setDescription('');
        await loadListings();
      }
    } catch (error) {
      console.error('Create listing error:', error);
    }
  };

  const handleRateSeller = async (listingId: string, rating: number) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/marketplace/rate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ listingId, rating })
        }
      );
      await loadListings();
    } catch (error) {
      console.error('Rate seller error:', error);
    }
  };

  const handleViewListing = async (listingId: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/marketplace/view/${listingId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );
      await loadListings();
    } catch (error) {
      console.error('View listing error:', error);
    }
  };

  const translations = {
    en: {
      marketplace: 'Marketplace',
      searchProducts: 'Search products, farmers, sellers...',
      searchLocation: 'Location',
      filters: 'Filters',
      sortBy: 'Sort by',
      rating: 'Top Rated',
      views: 'Most Viewed',
      priceLow: 'Price: Low to High',
      priceHigh: 'Price: High to Low',
      newest: 'Newest First',
      createListing: 'Create Listing',
      selectProduct: 'Select Product',
      pricePerUnit: 'Price per unit',
      quantityAvailable: 'Quantity Available',
      description: 'Description',
      submit: 'Create Listing',
      cancel: 'Cancel',
      noProducts: 'Add products first to create listings',
      noListings: 'No listings found',
      contact: 'Contact Seller',
      topSeller: 'Top Seller',
      views: 'views'
    },
    fr: {
      marketplace: 'Marché',
      searchProducts: 'Rechercher des produits, agriculteurs, vendeurs...',
      searchLocation: 'Lieu',
      filters: 'Filtres',
      sortBy: 'Trier par',
      rating: 'Mieux notés',
      views: 'Plus vus',
      priceLow: 'Prix: Bas à Haut',
      priceHigh: 'Prix: Haut à Bas',
      newest: 'Plus récent',
      createListing: 'Créer une annonce',
      selectProduct: 'Sélectionner le produit',
      pricePerUnit: 'Prix par unité',
      quantityAvailable: 'Quantité disponible',
      description: 'Description',
      submit: 'Créer une annonce',
      cancel: 'Annuler',
      noProducts: 'Ajoutez d\'abord des produits',
      noListings: 'Aucune annonce trouvée',
      contact: 'Contacter le vendeur',
      topSeller: 'Meilleur vendeur',
      views: 'vues'
    },
    rw: {
      marketplace: 'Isoko',
      searchProducts: 'Shakisha ibicuruzwa, abahinzi, abagurisha...',
      searchLocation: 'Ahantu',
      filters: 'Akayunguruzo',
      sortBy: 'Shiraho',
      rating: 'Byiza cyane',
      views: 'Byareboye cyane',
      priceLow: 'Igiciro: Hasi kugeza hejuru',
      priceHigh: 'Igiciro: Hejuru kugeza hasi',
      newest: 'Ibya vuba',
      createListing: 'Shiraho icyangombwa',
      selectProduct: 'Hitamo ibicuruzwa',
      pricePerUnit: 'Igiciro kuri buri kintu',
      quantityAvailable: 'Umubare uraboneka',
      description: 'Ibisobanuro',
      submit: 'Shiraho',
      cancel: 'Hagarika',
      noProducts: 'Ongeraho ibicuruzwa mbere',
      noListings: 'Nta bibanza biboneka',
      contact: 'Hamagara ugurisha',
      topSeller: 'Ugurisha mwiza',
      views: 'reba'
    }
  };

  const lang = profile?.language || 'en';
  const t = translations[lang as keyof typeof translations] || translations.en;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-gray-900 dark:text-white">{t.marketplace}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {filteredListings.length} {t.noListings.split(' ')[0]}
          </p>
        </div>
        <button
          onClick={() => setShowCreateListing(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {t.createListing}
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchProducts}
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
            />
          </div>

          {/* Location Input */}
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder={t.searchLocation}
              className="bg-transparent outline-none text-gray-900 dark:text-white w-32"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter className="w-5 h-5" />
            {t.filters}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Categories */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">{t.sortBy}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="rating">{t.rating}</option>
                  <option value="views">{t.views}</option>
                  <option value="price-low">{t.priceLow}</option>
                  <option value="price-high">{t.priceHigh}</option>
                  <option value="newest">{t.newest}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Listing Form */}
      {showCreateListing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900 dark:text-white">{t.createListing}</h3>
            <button
              onClick={() => setShowCreateListing(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {myProducts.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">{t.noProducts}</p>
          ) : (
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.selectProduct}</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Choose a product...</option>
                  {myProducts.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.quantity} {product.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.pricePerUnit} (RWF)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.quantityAvailable}</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.description}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t.submit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateListing(false)}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Listings Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => {
            const rating = listing.rating || 0;
            const views = listing.views || 0;
            const isTopSeller = rating >= 4.5;

            return (
              <div
                key={listing.id}
                onClick={() => handleViewListing(listing.id)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer relative"
              >
                {/* Top Seller Badge */}
                {isTopSeller && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-lg">
                    <Award className="w-3 h-3" />
                    {t.topSeller}
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center text-2xl">
                    {listing.category === 'livestock' ? '🐄' : '🌾'}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-yellow-500 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {rating.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{views}</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-gray-900 dark:text-white mb-2">{listing.productName || 'Product'}</h4>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Price:</span>
                    <span className="text-green-600 dark:text-green-400">{listing.price} RWF/{listing.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Available:</span>
                    <span className="text-gray-900 dark:text-white text-sm">{listing.quantity} {listing.unit}</span>
                  </div>
                </div>

                {listing.description && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">{listing.description}</p>
                )}

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.farmerLocation || 'Location not specified'}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seller: {listing.farmerName}
                  </p>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRateSeller(listing.id, star);
                        }}
                        className="text-gray-300 dark:text-gray-600 hover:text-yellow-500 transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating ? 'fill-yellow-500 text-yellow-500' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t.contact}
                </button>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 dark:text-gray-400">{t.noListings}</p>
          </div>
        )}
      </div>
    </div>
  );
}
