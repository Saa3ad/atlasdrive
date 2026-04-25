<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 20L10 8L16 16L20 10L24 20" stroke="#0d9488" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 14L6 10" stroke="#0d9488" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span class="brand-name">Atlas Drive</span>
    </div>

    <ul class="nav-links">
      <li><a href="#" class="nav-link active">Home</a></li>
      <li><a href="#" class="nav-link">Fleet</a></li>
      <li><a href="#" class="nav-link">Agencies</a></li>
      <li><a href="#" class="nav-link">Pricing</a></li>
    </ul>

    <button class="btn-login">Log In</button>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.brand-name {
  font-family: 'Sora', sans-serif;
  font-weight: 700;
  font-size: 1.2rem;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-link {
  text-decoration: none;
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.active {
  color: #0d9488;
}

.btn-login {
  background: #0d9488;
  color: white;
  border: none;
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-login:hover {
  background: #0f766e;
  transform: translateY(-1px);
}
</style>