<template>
  <div class="bg-slate-100 min-h-screen">

    <!-- ── Hero ── -->
    <section class="fleet-hero">
      <div class="absolute inset-0 hero-overlay"></div>
      <div class="relative z-10 text-center max-w-4xl mx-auto px-8 py-14">
        <span class="hero-badge">🚗 Premium Vehicle Collection</span>
        <h1 class="sora text-5xl font-bold text-white mt-4 mb-3 tracking-tight"
          style="text-shadow:0 2px 16px rgba(0,0,0,0.3)">Our Fleet</h1>
        <p class="sora text-teal-100 text-lg font-medium mb-8">
          Browse our curated selection of vehicles — luxury, family, electric and more.
        </p>
        <div class="hero-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input v-model="searchQuery" type="text"
            placeholder="Search by model, brand or category..." class="sora hero-search-input"/>
          <button class="sora hero-search-btn">Search</button>
        </div>
      </div>
    </section>

    <!-- ── Main Layout ── -->
    <div style="max-width:1400px;margin:0 auto;padding:2rem 2rem;">
      <div style="display:flex;gap:1.5rem;align-items:flex-start;">

        <!-- ── Sidebar ── -->
        <aside style="width:240px;flex-shrink:0;position:sticky;top:80px;">

          <div class="filter-card">
            <h3 class="filter-title">Category</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <label v-for="cat in categories" :key="cat.value" class="filter-option">
                <input type="checkbox" :value="cat.value" v-model="selectedCategories" class="filter-checkbox"/>
                <span class="sora" style="font-size:0.85rem;color:#475569;flex:1;">{{ cat.label }}</span>
                <span class="sora" style="font-size:0.75rem;color:#94a3b8;font-weight:600;">{{ cat.count }}</span>
              </label>
            </div>
          </div>

          <div class="filter-card">
            <h3 class="filter-title">Price per day</h3>
            <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
              <span class="sora" style="font-size:0.78rem;color:#0d9488;font-weight:700;">${{ priceRange[0] }}</span>
              <span class="sora" style="font-size:0.78rem;color:#0d9488;font-weight:700;">${{ priceRange[1] }}</span>
            </div>
            <input type="range" min="20" max="600" v-model="priceRange[1]" class="price-slider" style="width:100%;margin-bottom:0.75rem;"/>
            <div style="display:flex;gap:0.5rem;">
              <div class="price-input-wrap">
                <span class="sora" style="font-size:0.7rem;color:#94a3b8;">Min</span>
                <input type="number" v-model="priceRange[0]" class="sora price-input"/>
              </div>
              <div class="price-input-wrap">
                <span class="sora" style="font-size:0.7rem;color:#94a3b8;">Max</span>
                <input type="number" v-model="priceRange[1]" class="sora price-input"/>
              </div>
            </div>
          </div>

          <div class="filter-card">
            <h3 class="filter-title">Fuel Type</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <label v-for="fuel in fuelTypes" :key="fuel" class="filter-option">
                <input type="checkbox" :value="fuel" v-model="selectedFuels" class="filter-checkbox"/>
                <span class="sora" style="font-size:0.85rem;color:#475569;">{{ fuel }}</span>
              </label>
            </div>
          </div>

          <div class="filter-card">
            <h3 class="filter-title">Transmission</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <label v-for="t in transmissions" :key="t" class="filter-option">
                <input type="checkbox" :value="t" v-model="selectedTransmissions" class="filter-checkbox"/>
                <span class="sora" style="font-size:0.85rem;color:#475569;">{{ t }}</span>
              </label>
            </div>
          </div>

          <div class="filter-card">
            <h3 class="filter-title">Availability</h3>
            <label class="filter-option">
              <input type="checkbox" v-model="onlyAvailable" class="filter-checkbox"/>
              <span class="sora" style="font-size:0.85rem;color:#475569;">Available now only</span>
            </label>
          </div>

          <button @click="resetFilters" class="sora reset-btn">↺ Reset all filters</button>
        </aside>

        <!-- ── Results ── -->
        <div style="flex:1;min-width:0;">

          <!-- Toolbar -->
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
            <p class="sora" style="font-size:0.85rem;color:#64748b;">
              Showing <span style="color:#0d9488;font-weight:700;">{{ filteredCars.length }}</span> vehicles
            </p>
            <div style="display:flex;align-items:center;gap:0.75rem;">
              <div class="sort-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                  <path d="M3 6h18M7 12h10M11 18h2"/>
                </svg>
                <select v-model="sortBy" class="sora sort-select">
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">A–Z</option>
                </select>
              </div>
              <div style="display:flex;gap:3px;background:white;border-radius:8px;padding:3px;border:1px solid #e2e8f0;">
                <button @click="view='grid'" :class="['view-btn', view==='grid'?'view-btn-active':'']">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </button>
                <button @click="view='list'" :class="['view-btn', view==='list'?'view-btn-active':'']">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Active pills -->
          <div v-if="activeFilters.length" style="display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
            <span v-for="f in activeFilters" :key="f.key" class="filter-pill sora">
              {{ f.label }}
              <button @click="removeFilter(f)" style="margin-left:4px;opacity:0.6;cursor:pointer;background:none;border:none;font-size:0.75rem;">✕</button>
            </span>
          </div>

          <!-- Empty -->
          <div v-if="filteredCars.length === 0" class="empty-state">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1.2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p class="sora" style="color:#94a3b8;font-weight:600;margin-top:1rem;">No vehicles match your filters</p>
            <button @click="resetFilters" class="sora" style="color:#0d9488;font-size:0.85rem;font-weight:600;margin-top:0.5rem;background:none;border:none;cursor:pointer;text-decoration:underline;">Clear all filters</button>
          </div>

          <!-- ── GRID VIEW ── -->
          <div v-else-if="view==='grid'" class="cars-grid">
            <div v-for="car in filteredCars" :key="car.id" class="car-card">

              <!-- Image -->
              <div class="car-img-wrap">
                <img :src="car.image" :alt="car.name" class="car-img"/>
                <!-- Gradient overlay on image -->
                <div class="img-gradient"></div>
                <!-- Badges -->
                <span :class="['avail-badge', car.available ? 'avail-green' : 'avail-red']">
                  {{ car.available ? '● Available' : '● Rented' }}
                </span>
                <button class="wishlist-btn" @click="toggleWishlist(car.id)" title="Save">
                  <svg width="15" height="15" viewBox="0 0 24 24"
                    :fill="wishlist.includes(car.id) ? '#ef4444' : 'none'"
                    stroke="#ef4444" stroke-width="2.2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
                <!-- Category on image -->
                <span class="cat-overlay sora">{{ car.category }}</span>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <!-- Brand logo area -->
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
                  <span class="sora" style="font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">{{ car.brand }}</span>
                  <div style="display:flex;align-items:center;gap:3px;">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="sora" style="font-size:0.78rem;font-weight:700;color:#374151;">{{ car.rating }}</span>
                    <span class="sora" style="font-size:0.7rem;color:#94a3b8;">({{ car.reviews }})</span>
                  </div>
                </div>

                <h3 class="sora car-name">{{ car.name }}</h3>
                <p class="sora" style="font-size:0.75rem;color:#94a3b8;margin-bottom:0.85rem;">{{ car.year }} · {{ car.transmission }}</p>

                <!-- Specs -->
                <div class="specs-grid">
                  <div class="spec-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span class="sora spec-text">{{ car.seats }} Seats</span>
                  </div>
                  <div class="spec-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <span class="sora spec-text">{{ car.fuel }}</span>
                  </div>
                  <div class="spec-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <rect x="2" y="9" width="20" height="9" rx="2"/><path d="M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2"/>
                      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
                    </svg>
                    <span class="sora spec-text">{{ car.doors }} Doors</span>
                  </div>
                  <div class="spec-box">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    <span class="sora spec-text">{{ car.ac ? 'A/C' : 'No A/C' }}</span>
                  </div>
                </div>

                <!-- Price + Book -->
                <div class="card-footer">
                  <div>
                    <span class="sora price-main">${{ car.pricePerDay }}</span>
                    <span class="sora price-unit">/day</span>
                  </div>
                  <button
                    :class="['sora book-btn', car.available ? 'book-btn-active' : 'book-btn-disabled']"
                    :disabled="!car.available"
                  >
                    {{ car.available ? 'Book Now' : 'Unavailable' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- ── LIST VIEW ── -->
          <div v-else style="display:flex;flex-direction:column;gap:1rem;">
            <div v-for="car in filteredCars" :key="car.id" class="list-card">
              <div class="list-img-wrap">
                <img :src="car.image" :alt="car.name" class="list-img"/>
                <span :class="['avail-badge', car.available ? 'avail-green' : 'avail-red']" style="position:absolute;top:10px;left:10px;">
                  {{ car.available ? '● Available' : '● Rented' }}
                </span>
              </div>
              <div style="flex:1;padding:1.25rem 1.5rem;min-width:0;">
                <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:0.25rem;">
                  <div>
                    <span class="sora" style="font-size:0.7rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">{{ car.brand }}</span>
                    <h3 class="sora" style="font-size:1.15rem;font-weight:800;color:#0f172a;line-height:1.2;margin:0.15rem 0;">{{ car.name }}</h3>
                    <p class="sora" style="font-size:0.78rem;color:#94a3b8;">{{ car.year }} · {{ car.category }} · {{ car.transmission }}</p>
                  </div>
                  <div style="display:flex;align-items:center;gap:4px;background:#fefce8;border:1px solid #fde68a;padding:0.25rem 0.5rem;border-radius:8px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span class="sora" style="font-size:0.82rem;font-weight:700;color:#374151;">{{ car.rating }}</span>
                    <span class="sora" style="font-size:0.75rem;color:#94a3b8;">({{ car.reviews }})</span>
                  </div>
                </div>
                <div style="display:flex;gap:1.5rem;margin-top:1rem;flex-wrap:wrap;">
                  <div class="spec-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    <span class="sora spec-text">{{ car.seats }} Seats</span>
                  </div>
                  <div class="spec-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                    <span class="sora spec-text">{{ car.fuel }}</span>
                  </div>
                  <div class="spec-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <rect x="2" y="9" width="20" height="9" rx="2"/><path d="M5 9V7a2 2 0 012-2h10a2 2 0 012 2v2"/>
                      <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
                    </svg>
                    <span class="sora spec-text">{{ car.doors }} Doors</span>
                  </div>
                  <div class="spec-box">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    <span class="sora spec-text">{{ car.ac ? 'Air Conditioning' : 'No A/C' }}</span>
                  </div>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;padding:1.25rem 1.5rem;border-left:1px solid #f1f5f9;min-width:150px;">
                <div style="text-align:right;">
                  <div>
                    <span class="sora" style="font-size:1.75rem;font-weight:800;color:#0f172a;">${{ car.pricePerDay }}</span>
                    <span class="sora" style="font-size:0.75rem;color:#94a3b8;">/day</span>
                  </div>
                  <p class="sora" style="font-size:0.72rem;color:#94a3b8;margin-top:2px;">${{ car.pricePerDay * 7 }}/week</p>
                </div>
                <button
                  :class="['sora book-btn', car.available ? 'book-btn-active' : 'book-btn-disabled']"
                  :disabled="!car.available"
                  style="width:100%;margin-top:1rem;"
                >
                  {{ car.available ? 'Book Now' : 'Unavailable' }}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer style="max-width:1400px;margin:2rem auto 0;padding:1rem 2rem;display:flex;align-items:center;justify-content:space-between;border-top:1px solid #e2e8f0;">
      <span class="sora" style="font-size:0.78rem;color:#94a3b8;">Partners: Atlas Drive, - Opportunities</span>
      <div style="display:flex;align-items:center;gap:1.25rem;">
        <span class="sora" style="font-size:0.82rem;font-weight:700;color:#f90;">amazon</span>
        <span class="sora" style="font-size:0.82rem;font-weight:700;color:#374151;">🌿 croncat</span>
        <span class="sora" style="font-size:0.82rem;font-weight:700;color:#374151;">✦ Atlas Drive</span>
        <span style="font-size:0.82rem;">🔴🟠</span>
        <span class="sora" style="font-size:0.82rem;font-weight:700;color:#003087;">PayPal</span>
        <span class="sora" style="font-size:0.9rem;font-weight:700;font-style:italic;color:#1a1f71;">VISA</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const view = ref('grid')
const searchQuery = ref('')
const selectedCategories = ref([])
const selectedFuels = ref([])
const selectedTransmissions = ref([])
const onlyAvailable = ref(false)
const priceRange = ref([20, 600])
const sortBy = ref('price-asc')
const wishlist = ref([])

const categories = [
  { label: 'Luxury',   value: 'Luxury',   count: 4 },
  { label: 'SUV',      value: 'SUV',      count: 4 },
  { label: 'Economy',  value: 'Economy',  count: 4 },
  { label: 'Electric', value: 'Electric', count: 3 },
  { label: 'Family',   value: 'Family',   count: 3 },
]
const fuelTypes     = ['Petrol', 'Diesel', 'Electric', 'Hybrid']
const transmissions = ['Automatic', 'Manual']

const cars = ref([
  // ── Luxury ──
  {
    id: 1, name: 'BMW 5 Series 530i', brand: 'BMW', year: 2023,
    category: 'Luxury', pricePerDay: 180, seats: 5, fuel: 'Petrol',
    transmission: 'Automatic', doors: 4, rating: 4.9, reviews: 128,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=700&q=85',
  },
  {
    id: 2, name: 'Mercedes-Benz E-Class', brand: 'Mercedes-Benz', year: 2023,
    category: 'Luxury', pricePerDay: 200, seats: 5, fuel: 'Diesel',
    transmission: 'Automatic', doors: 4, rating: 4.8, reviews: 94,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=700&q=85',
  },
  {
    id: 3, name: 'Audi A6 Quattro', brand: 'Audi', year: 2023,
    category: 'Luxury', pricePerDay: 195, seats: 5, fuel: 'Petrol',
    transmission: 'Automatic', doors: 4, rating: 4.8, reviews: 87,
    available: false, ac: true,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=700&q=85',
  },
  {
    id: 4, name: 'Porsche Cayenne GTS', brand: 'Porsche', year: 2023,
    category: 'Luxury', pricePerDay: 380, seats: 5, fuel: 'Petrol',
    transmission: 'Automatic', doors: 4, rating: 4.9, reviews: 52,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&q=85',
  },
  // ── SUV ──
  {
    id: 5, name: 'Toyota Land Cruiser', brand: 'Toyota', year: 2023,
    category: 'SUV', pricePerDay: 175, seats: 7, fuel: 'Diesel',
    transmission: 'Automatic', doors: 5, rating: 4.9, reviews: 211,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&q=85',
  },
  {
    id: 6, name: 'Honda CR-V Hybrid', brand: 'Honda', year: 2023,
    category: 'SUV', pricePerDay: 115, seats: 5, fuel: 'Hybrid',
    transmission: 'Automatic', doors: 5, rating: 4.7, reviews: 199,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=700&q=85',
  },
  {
    id: 7, name: 'Dacia Duster 4x4', brand: 'Dacia', year: 2022,
    category: 'SUV', pricePerDay: 65, seats: 5, fuel: 'Diesel',
    transmission: 'Manual', doors: 5, rating: 4.3, reviews: 184,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=700&q=85',
  },
  {
    id: 8, name: 'Hyundai Tucson N Line', brand: 'Hyundai', year: 2023,
    category: 'SUV', pricePerDay: 95, seats: 5, fuel: 'Petrol',
    transmission: 'Automatic', doors: 5, rating: 4.5, reviews: 143,
    available: false, ac: true,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=700&q=85',
  },
  // ── Economy ──
  {
    id: 9, name: 'Toyota Corolla 1.6', brand: 'Toyota', year: 2022,
    category: 'Economy', pricePerDay: 48, seats: 5, fuel: 'Petrol',
    transmission: 'Manual', doors: 4, rating: 4.5, reviews: 318,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=85',
  },
  {
    id: 10, name: 'Volkswagen Polo TSI', brand: 'Volkswagen', year: 2022,
    category: 'Economy', pricePerDay: 42, seats: 5, fuel: 'Petrol',
    transmission: 'Manual', doors: 4, rating: 4.4, reviews: 265,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=700&q=85',
  },
  {
    id: 11, name: 'Renault Clio RS Line', brand: 'Renault', year: 2022,
    category: 'Economy', pricePerDay: 38, seats: 5, fuel: 'Petrol',
    transmission: 'Automatic', doors: 4, rating: 4.3, reviews: 201,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=700&q=85',
  },
  {
    id: 12, name: 'Peugeot 208 Active', brand: 'Peugeot', year: 2023,
    category: 'Economy', pricePerDay: 40, seats: 5, fuel: 'Petrol',
    transmission: 'Manual', doors: 4, rating: 4.4, reviews: 178,
    available: false, ac: true,
    image: 'https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=700&q=85',
  },
  // ── Electric ──
  {
    id: 13, name: 'Tesla Model 3 LR', brand: 'Tesla', year: 2024,
    category: 'Electric', pricePerDay: 160, seats: 5, fuel: 'Electric',
    transmission: 'Automatic', doors: 4, rating: 4.9, reviews: 215,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&q=85',
  },
  {
    id: 14, name: 'Renault Zoe R135', brand: 'Renault', year: 2023,
    category: 'Electric', pricePerDay: 78, seats: 5, fuel: 'Electric',
    transmission: 'Automatic', doors: 4, rating: 4.5, reviews: 140,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85',
  },
  {
    id: 15, name: 'Peugeot e-2008', brand: 'Peugeot', year: 2023,
    category: 'Electric', pricePerDay: 95, seats: 5, fuel: 'Electric',
    transmission: 'Automatic', doors: 5, rating: 4.6, reviews: 89,
    available: false, ac: true,
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=700&q=85',
  },
  // ── Family ──
  {
    id: 16, name: 'Volkswagen Touran', brand: 'Volkswagen', year: 2022,
    category: 'Family', pricePerDay: 110, seats: 7, fuel: 'Diesel',
    transmission: 'Automatic', doors: 5, rating: 4.6, reviews: 162,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=700&q=85',
  },
  {
    id: 17, name: 'Ford S-MAX Titanium', brand: 'Ford', year: 2022,
    category: 'Family', pricePerDay: 105, seats: 7, fuel: 'Diesel',
    transmission: 'Automatic', doors: 5, rating: 4.5, reviews: 134,
    available: true, ac: true,
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=700&q=85',
  },
  {
    id: 18, name: 'Citroën Berlingo XL', brand: 'Citroën', year: 2023,
    category: 'Family', pricePerDay: 88, seats: 7, fuel: 'Petrol',
    transmission: 'Manual', doors: 5, rating: 4.4, reviews: 97,
    available: false, ac: true,
    image: 'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=700&q=85',
  },
])

const filteredCars = computed(() => {
  let list = cars.value.filter(car => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch = !q || car.name.toLowerCase().includes(q) || car.brand.toLowerCase().includes(q) || car.category.toLowerCase().includes(q)
    const matchCat    = !selectedCategories.value.length || selectedCategories.value.includes(car.category)
    const matchFuel   = !selectedFuels.value.length || selectedFuels.value.includes(car.fuel)
    const matchTrans  = !selectedTransmissions.value.length || selectedTransmissions.value.includes(car.transmission)
    const matchPrice  = car.pricePerDay >= priceRange.value[0] && car.pricePerDay <= priceRange.value[1]
    const matchAvail  = !onlyAvailable.value || car.available
    return matchSearch && matchCat && matchFuel && matchTrans && matchPrice && matchAvail
  })
  if (sortBy.value === 'price-asc')  list = [...list].sort((a,b) => a.pricePerDay - b.pricePerDay)
  if (sortBy.value === 'price-desc') list = [...list].sort((a,b) => b.pricePerDay - a.pricePerDay)
  if (sortBy.value === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating)
  if (sortBy.value === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name))
  return list
})

const activeFilters = computed(() => {
  const f = []
  selectedCategories.value.forEach(c  => f.push({ key:'cat-'+c,   label: c,             type:'cat',   value:c }))
  selectedFuels.value.forEach(v       => f.push({ key:'fuel-'+v,  label: v,             type:'fuel',  value:v }))
  selectedTransmissions.value.forEach(v => f.push({ key:'trans-'+v, label: v,           type:'trans', value:v }))
  if (onlyAvailable.value)               f.push({ key:'avail',    label:'Available only',type:'avail'         })
  return f
})
function removeFilter(f) {
  if (f.type==='cat')   selectedCategories.value    = selectedCategories.value.filter(v=>v!==f.value)
  if (f.type==='fuel')  selectedFuels.value         = selectedFuels.value.filter(v=>v!==f.value)
  if (f.type==='trans') selectedTransmissions.value = selectedTransmissions.value.filter(v=>v!==f.value)
  if (f.type==='avail') onlyAvailable.value = false
}
function resetFilters() {
  selectedCategories.value = []
  selectedFuels.value = []
  selectedTransmissions.value = []
  onlyAvailable.value = false
  priceRange.value = [20, 600]
  searchQuery.value = ''
}
function toggleWishlist(id) {
  wishlist.value = wishlist.value.includes(id)
    ? wishlist.value.filter(i => i !== id)
    : [...wishlist.value, id]
}
</script>

<style scoped>
.sora { font-family: 'Sora', sans-serif; }

/* Hero */
.fleet-hero {
  position: relative;
  background: linear-gradient(135deg, #0f2027 0%, #0d4f47 50%, #0d9488 100%);
  overflow: hidden;
}
.fleet-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=50') center/cover no-repeat;
  opacity: 0.07;
}
.hero-overlay {
  background: linear-gradient(135deg, rgba(15,32,39,0.82) 0%, rgba(13,79,71,0.78) 100%);
}
.hero-badge {
  display: inline-block;
  font-family: 'Sora', sans-serif; font-size: 0.75rem; font-weight: 600;
  color: #ccfbf1; background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2); border-radius: 999px;
  padding: 0.3rem 1rem; backdrop-filter: blur(4px);
}
.hero-search {
  display: flex; align-items: center; gap: 0.75rem;
  background: white; border-radius: 14px;
  padding: 0.85rem 1.25rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.2);
  max-width: 580px; margin: 0 auto;
}
.hero-search-input {
  flex: 1; border: none; outline: none;
  font-size: 0.9rem; color: #374151; background: transparent;
}
.hero-search-input::placeholder { color: #9ca3af; }
.hero-search-btn {
  background: #0d9488; color: white; border: none;
  padding: 0.5rem 1.25rem; border-radius: 8px;
  font-size: 0.85rem; font-weight: 600; cursor: pointer; white-space: nowrap;
  transition: background 0.2s;
}
.hero-search-btn:hover { background: #0f766e; }

/* Sidebar */
.filter-card {
  background: white; border-radius: 12px;
  padding: 1rem 1.1rem; margin-bottom: 0.75rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.filter-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem; font-weight: 700;
  color: #94a3b8; text-transform: uppercase;
  letter-spacing: 0.1em; margin-bottom: 0.75rem;
}
.filter-option {
  display: flex; align-items: center;
  gap: 0.6rem; cursor: pointer; padding: 0.15rem 0;
}
.filter-checkbox { accent-color: #0d9488; width: 14px; height: 14px; cursor: pointer; flex-shrink: 0; }
.price-slider { accent-color: #0d9488; }
.price-input-wrap {
  flex: 1; border: 1.5px solid #e2e8f0; border-radius: 7px;
  padding: 0.3rem 0.55rem; display: flex; flex-direction: column;
}
.price-input { border: none; outline: none; font-size: 0.8rem; color: #374151; width: 100%; background: transparent; }
.reset-btn {
  width: 100%; border: 1.5px solid #e2e8f0; background: white;
  color: #64748b; padding: 0.6rem; border-radius: 10px;
  font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s;
}
.reset-btn:hover { border-color: #0d9488; color: #0d9488; background: #f0fdfa; }

/* Toolbar */
.sort-wrap {
  display: flex; align-items: center; gap: 0.4rem;
  border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 0.4rem 0.75rem; background: white;
}
.sort-select { border: none; outline: none; font-size: 0.82rem; color: #374151; background: transparent; cursor: pointer; font-weight: 500; }
.view-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 30px; border-radius: 6px;
  border: none; background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.15s;
}
.view-btn:hover { background: #f1f5f9; color: #475569; }
.view-btn-active { background: #0d9488 !important; color: white !important; }

.filter-pill {
  display: inline-flex; align-items: center;
  font-size: 0.72rem; font-weight: 600; color: #0d9488;
  background: #f0fdfa; border: 1px solid #99f6e4;
  border-radius: 999px; padding: 0.25rem 0.7rem;
}
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 5rem 2rem;
  background: white; border-radius: 16px;
}

/* ── Grid ── */
.cars-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.car-card {
  background: white; border-radius: 16px; overflow: hidden;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  display: flex; flex-direction: column;
}
.car-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(13,148,136,0.15);
  border-color: #0d9488;
}

/* Image area — fixed height */
.car-img-wrap {
  position: relative;
  height: 190px;
  overflow: hidden;
  background: #f1f5f9;
}
.car-img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s ease;
}
.car-card:hover .car-img { transform: scale(1.06); }
.img-gradient {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%);
}

.avail-badge {
  position: absolute; top: 10px; left: 10px;
  font-family: 'Sora', sans-serif; font-size: 0.65rem; font-weight: 700;
  padding: 0.22rem 0.6rem; border-radius: 999px;
}
.avail-green { background: rgba(209,250,229,0.95); color: #065f46; }
.avail-red   { background: rgba(254,226,226,0.95); color: #991b1b; }

.wishlist-btn {
  position: absolute; top: 9px; right: 9px;
  width: 32px; height: 32px; border-radius: 50%;
  background: white; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.12); transition: transform 0.2s;
}
.wishlist-btn:hover { transform: scale(1.15); }

.cat-overlay {
  position: absolute; bottom: 10px; right: 10px;
  font-size: 0.65rem; font-weight: 700; color: white;
  background: rgba(0,0,0,0.45); backdrop-filter: blur(6px);
  padding: 0.2rem 0.6rem; border-radius: 999px;
}

/* Card body */
.card-body {
  padding: 1rem 1.1rem 1rem;
  display: flex; flex-direction: column; flex: 1;
}
.car-name {
  font-size: 0.95rem; font-weight: 800;
  color: #0f172a; line-height: 1.3;
  margin-bottom: 0.15rem;
}

/* Specs 2x2 grid */
.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.spec-box {
  display: flex; align-items: center; gap: 0.35rem;
  background: #f8fafc; border-radius: 7px;
  padding: 0.35rem 0.5rem;
}
.spec-text {
  font-size: 0.75rem; color: #475569; font-weight: 600;
}

/* Price + book */
.card-footer {
  display: flex; align-items: center;
  justify-content: space-between; margin-top: auto;
  padding-top: 0.85rem;
  border-top: 1px solid #f1f5f9;
}
.price-main { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
.price-unit { font-size: 0.75rem; color: #94a3b8; margin-left: 1px; }

.book-btn {
  padding: 0.5rem 1rem; border-radius: 8px;
  font-size: 0.8rem; font-weight: 700; border: none;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.book-btn-active { background: #0d9488; color: white; }
.book-btn-active:hover { background: #0f766e; transform: translateY(-1px); }
.book-btn-disabled { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }

/* ── List Card ── */
.list-card {
  background: white; border-radius: 16px; overflow: hidden;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.list-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(13,148,136,0.12);
  border-color: #0d9488;
}
.list-img-wrap { position: relative; width: 240px; flex-shrink: 0; }
.list-img { width: 100%; height: 100%; object-fit: cover; }
</style>