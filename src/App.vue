<template>
  <div id="app">
    <Navbar />
    <Hero />
    <HomePage />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Hero from './components/Hero.vue'
import HomePage from './pages/home.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Sora', sans-serif;
  background: #f1f5f9;
}

#app {
  min-height: 100vh;
}
</style>