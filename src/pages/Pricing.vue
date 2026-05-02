<template>
  <div class="bg-slate-100 min-h-screen">

    <!-- ── Hero Header ── -->
    <section class="pricing-hero">
      <div class="absolute inset-0 hero-overlay"></div>
      <div class="relative z-10 text-center max-w-3xl mx-auto px-8 py-16">
        <span class="hero-badge">💳 Simple, Transparent Pricing</span>
        <h1 class="sora text-5xl font-bold text-white mt-4 mb-4 tracking-tight" style="text-shadow: 0 2px 16px rgba(0,0,0,0.3);">
          Choose Your Plan
        </h1>
        <p class="sora text-teal-100 text-lg font-medium mb-8">
          Scale your rental business with the right tools. No hidden fees, cancel anytime.
        </p>

        <!-- Toggle: Monthly / Yearly -->
        <div class="toggle-wrap">
          <span class="sora text-sm font-semibold" :class="!yearly ? 'text-white' : 'text-teal-200'">Monthly</span>
          <button @click="yearly = !yearly" class="toggle-btn" :class="{ active: yearly }">
            <span class="toggle-knob" :class="{ moved: yearly }"></span>
          </button>
          <span class="sora text-sm font-semibold" :class="yearly ? 'text-white' : 'text-teal-200'">
            Yearly <span class="save-badge">Save 20%</span>
          </span>
        </div>
      </div>
    </section>

    <!-- ── Pricing Cards ── -->
    <section class="max-w-6xl mx-auto px-8 -mt-8 pb-4">
      <div class="grid grid-cols-3 gap-6">
        <div
          v-for="plan in plans"
          :key="plan.name"
          :class="['pricing-card', plan.featured ? 'pricing-card-featured' : '']"
        >
          <!-- Popular badge -->
          <div v-if="plan.featured" class="popular-badge">⭐ Most Popular</div>

          <!-- Plan icon + name -->
          <div class="flex items-center gap-3 mb-4">
            <div class="plan-icon" :style="{ background: plan.color + '20', color: plan.color }">
              <span v-html="plan.icon"></span>
            </div>
            <div>
              <h3 class="sora text-lg font-bold text-slate-900">{{ plan.name }}</h3>
              <p class="sora text-xs text-slate-500">{{ plan.subtitle }}</p>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <div class="flex items-end gap-1">
              <span class="sora text-4xl font-bold text-slate-900">
                ${{ yearly ? plan.yearlyPrice : plan.monthlyPrice }}
              </span>
              <span class="sora text-sm text-slate-400 mb-2">/month</span>
            </div>
            <p v-if="yearly" class="sora text-xs text-teal-600 font-semibold mt-1">
              Billed ${{ plan.yearlyPrice * 12 }}/year — save ${{ (plan.monthlyPrice - plan.yearlyPrice) * 12 }}
            </p>
            <p v-else class="sora text-xs text-slate-400 mt-1">Billed monthly, cancel anytime</p>
          </div>

          <!-- CTA button -->
          <button :class="['plan-btn', plan.featured ? 'plan-btn-featured' : 'plan-btn-default']">
            {{ plan.cta }}
          </button>

          <!-- Divider -->
          <div class="border-t border-slate-100 my-5"></div>

          <!-- Features list -->
          <ul class="space-y-3">
            <li v-for="feature in plan.features" :key="feature.text" class="flex items-start gap-2.5">
              <span :class="['feature-check', feature.included ? 'check-yes' : 'check-no']">
                <svg v-if="feature.included" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </span>
              <span class="sora text-sm" :class="feature.included ? 'text-slate-700' : 'text-slate-400'">
                {{ feature.text }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ── Trust bar ── -->
    <div class="max-w-6xl mx-auto px-8 py-8">
      <div class="trust-bar">
        <div v-for="t in trustItems" :key="t.label" class="trust-item">
          <span class="trust-icon" v-html="t.icon"></span>
          <span class="sora text-sm font-semibold text-slate-700">{{ t.label }}</span>
        </div>
      </div>
    </div>

    <!-- ── Feature Comparison Table ── -->
    <section class="max-w-6xl mx-auto px-8 pb-10">
      <h2 class="sora text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">Compare All Features</h2>
      <p class="sora text-sm text-slate-500 text-center mb-8">Everything you need to make the right choice</p>

      <div class="comparison-table">
        <!-- Header -->
        <div class="table-header">
          <div class="col-feature sora text-sm font-bold text-slate-500 uppercase tracking-wide">Feature</div>
          <div v-for="plan in plans" :key="plan.name"
            :class="['col-plan sora text-sm font-bold text-center', plan.featured ? 'text-teal-600' : 'text-slate-700']">
            {{ plan.name }}
          </div>
        </div>

        <!-- Rows -->
        <div v-for="(group, gi) in comparisonGroups" :key="gi">
          <!-- Group label -->
          <div class="table-group-label">
            <span class="sora text-xs font-bold uppercase tracking-widest text-teal-600">{{ group.label }}</span>
          </div>
          <!-- Feature rows -->
          <div v-for="(row, ri) in group.rows" :key="ri" class="table-row">
            <div class="col-feature">
              <span class="sora text-sm text-slate-700">{{ row.feature }}</span>
            </div>
            <div v-for="(val, vi) in row.values" :key="vi" class="col-plan text-center">
              <span v-if="val === true" class="check-yes inline-flex items-center justify-center w-6 h-6 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span v-else-if="val === false" class="check-no inline-flex items-center justify-center w-6 h-6 rounded-full">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </span>
              <span v-else class="sora text-sm font-semibold text-slate-700">{{ val }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── FAQ ── -->
    <section class="max-w-3xl mx-auto px-8 pb-12">
      <h2 class="sora text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">Frequently Asked Questions</h2>
      <p class="sora text-sm text-slate-500 text-center mb-8">Still have questions? We're here to help.</p>

      <div class="faq-list">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="faq-item"
          @click="openFaq = openFaq === i ? null : i"
        >
          <div class="faq-question">
            <span class="sora text-sm font-semibold text-slate-800">{{ faq.q }}</span>
            <span class="faq-chevron" :class="{ rotated: openFaq === i }">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </span>
          </div>
          <div class="faq-answer" :class="{ open: openFaq === i }">
            <p class="sora text-sm text-slate-500 leading-relaxed pt-3">{{ faq.a }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA Banner ── -->
    <section class="max-w-6xl mx-auto px-8 pb-12">
      <div class="cta-banner">
        <div class="cta-glow"></div>
        <div class="relative z-10 text-center">
          <h2 class="sora text-3xl font-bold text-white mb-3 tracking-tight">Ready to grow your fleet?</h2>
          <p class="sora text-teal-100 mb-8 text-base">Start your 14-day free trial. No credit card required.</p>
          <div class="flex items-center justify-center gap-4 flex-wrap">
            <button class="sora cta-btn-white">Start Free Trial →</button>
            <button class="sora cta-btn-outline">Talk to Sales</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Partners (matching home) -->
    <footer class="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between border-t border-slate-200">
      <span class="sora text-xs text-slate-500">Partners: Atlas Drive, - Opportunities</span>
      <div class="flex items-center gap-5">
        <span class="sora text-sm font-bold" style="color:#f90;">amazon</span>
        <span class="sora text-sm font-bold text-gray-700">🌿 croncat</span>
        <span class="sora text-sm font-bold text-gray-700">✦ Atlas Drive</span>
        <span class="text-sm">🔴🟠</span>
        <span class="sora text-sm font-bold" style="color:#003087;">PayPal</span>
        <span class="sora text-base font-bold italic" style="color:#1a1f71;">VISA</span>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const yearly = ref(false)
const openFaq = ref(null)

const plans = [
  {
    name: 'Starter',
    subtitle: 'Perfect for small agencies',
    monthlyPrice: 29,
    yearlyPrice: 23,
    color: '#64748b',
    featured: false,
    cta: 'Get Started Free',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
    features: [
      { text: 'Up to 10 vehicles', included: true },
      { text: '1 agency location', included: true },
      { text: 'Basic booking management', included: true },
      { text: 'Client portal access', included: true },
      { text: 'Email support', included: true },
      { text: 'Analytics dashboard', included: false },
      { text: 'Multi-location support', included: false },
      { text: 'Priority support', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Professional',
    subtitle: 'For growing rental businesses',
    monthlyPrice: 79,
    yearlyPrice: 63,
    color: '#0d9488',
    featured: true,
    cta: 'Start 14-Day Trial',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    features: [
      { text: 'Up to 50 vehicles', included: true },
      { text: '3 agency locations', included: true },
      { text: 'Advanced booking management', included: true },
      { text: 'Client portal access', included: true },
      { text: 'Priority email & chat support', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Multi-location support', included: true },
      { text: 'Priority support', included: false },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
    ],
  },
  {
    name: 'Enterprise',
    subtitle: 'For large-scale operations',
    monthlyPrice: 199,
    yearlyPrice: 159,
    color: '#7c3aed',
    featured: false,
    cta: 'Contact Sales',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    features: [
      { text: 'Unlimited vehicles', included: true },
      { text: 'Unlimited locations', included: true },
      { text: 'Advanced booking management', included: true },
      { text: 'Client portal access', included: true },
      { text: '24/7 dedicated support', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Multi-location support', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
    ],
  },
]

const comparisonGroups = [
  {
    label: 'Fleet Management',
    rows: [
      { feature: 'Number of vehicles', values: ['10', '50', 'Unlimited'] },
      { feature: 'Agency locations', values: ['1', '3', 'Unlimited'] },
      { feature: 'Vehicle categories', values: ['3', '5', 'All'] },
      { feature: 'Fleet analytics', values: [false, true, true] },
    ],
  },
  {
    label: 'Bookings & Clients',
    rows: [
      { feature: 'Online booking portal', values: [true, true, true] },
      { feature: 'Client management CRM', values: [false, true, true] },
      { feature: 'Automated reminders', values: [false, true, true] },
      { feature: 'Custom booking forms', values: [false, false, true] },
    ],
  },
  {
    label: 'Support & Integrations',
    rows: [
      { feature: 'Email support', values: [true, true, true] },
      { feature: 'Live chat support', values: [false, true, true] },
      { feature: '24/7 dedicated support', values: [false, false, true] },
      { feature: 'API access', values: [false, false, true] },
      { feature: 'Custom branding', values: [false, false, true] },
    ],
  },
]

const trustItems = [
  {
    label: 'No credit card required',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  },
  {
    label: 'Cancel anytime',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
  },
  {
    label: '14-day free trial',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  },
  {
    label: 'GDPR compliant',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  },
  {
    label: '99.9% uptime SLA',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
]

const faqs = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any billing differences automatically.',
  },
  {
    q: 'Is there a free trial available?',
    a: 'Absolutely. Every new account gets a 14-day free trial on the Professional plan — no credit card required. After the trial, you can choose the plan that fits best.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual Enterprise plans.',
  },
  {
    q: 'Do you offer discounts for yearly billing?',
    a: 'Yes — switching to yearly billing saves you 20% compared to monthly. You can toggle between billing cycles at any time from your account settings.',
  },
  {
    q: 'What happens if I exceed my vehicle limit?',
    a: 'We\'ll notify you when you\'re approaching your limit. You can upgrade your plan at any time, or add extra vehicle slots at $5/vehicle/month on Starter and Professional plans.',
  },
  {
    q: 'Is my data secure?',
    a: 'Security is our top priority. All data is encrypted at rest and in transit, we\'re fully GDPR compliant, and we perform daily backups. Enterprise plans also include dedicated infrastructure.',
  },
]
</script>

<style scoped>
.sora { font-family: 'Sora', sans-serif; }

/* ── Hero ── */
.pricing-hero {
  position: relative;
  background: linear-gradient(135deg, #0f2027 0%, #0d4f47 50%, #0d9488 100%);
  overflow: hidden;
}
.pricing-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 20% 50%, rgba(13,148,136,0.3) 0%, transparent 60%),
                    radial-gradient(circle at 80% 20%, rgba(124,58,237,0.2) 0%, transparent 50%);
}
.hero-overlay {
  background: linear-gradient(135deg, rgba(15,32,39,0.7) 0%, rgba(13,79,71,0.6) 100%);
}
.hero-badge {
  display: inline-block;
  font-family: 'Sora', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ccfbf1;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 999px;
  padding: 0.3rem 1rem;
  backdrop-filter: blur(4px);
}

/* ── Toggle ── */
.toggle-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  padding: 0.5rem 1.25rem;
  backdrop-filter: blur(4px);
}
.toggle-btn {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(255,255,255,0.25);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
}
.toggle-btn.active { background: #0d9488; }
.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
  display: block;
}
.toggle-knob.moved { transform: translateX(20px); }
.save-badge {
  background: #fef08a;
  color: #854d0e;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  margin-left: 0.3rem;
}

/* ── Pricing Cards ── */
.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  position: relative;
  border: 1.5px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}
.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.pricing-card-featured {
  border-color: #0d9488;
  box-shadow: 0 8px 32px rgba(13,148,136,0.18);
  transform: translateY(-8px);
}
.pricing-card-featured:hover {
  transform: translateY(-12px);
}

.popular-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #0d9488;
  color: white;
  font-family: 'Sora', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  white-space: nowrap;
}

.plan-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.plan-btn-featured {
  background: #0d9488;
  color: white;
}
.plan-btn-featured:hover { background: #0f766e; transform: translateY(-1px); }
.plan-btn-default {
  background: #f1f5f9;
  color: #374151;
  border: 1.5px solid #e2e8f0;
}
.plan-btn-default:hover { background: #e2e8f0; transform: translateY(-1px); }

.feature-check {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.check-yes { background: #d1fae5; color: #065f46; }
.check-no  { background: #f1f5f9; color: #cbd5e1; }

/* ── Trust Bar ── */
.trust-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  background: white;
  border-radius: 14px;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  flex-wrap: wrap;
}
.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.trust-icon { display: flex; align-items: center; }

/* ── Comparison Table ── */
.comparison-table {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
}
.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
}
.col-feature { font-family: 'Sora', sans-serif; }
.col-plan { font-family: 'Sora', sans-serif; }

.table-group-label {
  padding: 0.75rem 1.5rem 0.4rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background 0.15s;
}
.table-row:hover { background: #f8fafc; }
.table-row:last-child { border-bottom: none; }

/* ── FAQ ── */
.faq-list { display: flex; flex-direction: column; gap: 0.5rem; }
.faq-item {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  cursor: pointer;
  border: 1.5px solid #e2e8f0;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.faq-item:hover {
  border-color: #0d9488;
  box-shadow: 0 4px 12px rgba(13,148,136,0.08);
}
.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.faq-chevron {
  color: #94a3b8;
  transition: transform 0.3s;
  flex-shrink: 0;
}
.faq-chevron.rotated { transform: rotate(180deg); color: #0d9488; }
.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s ease;
}
.faq-answer.open { max-height: 200px; }

/* ── CTA Banner ── */
.cta-banner {
  position: relative;
  background: linear-gradient(135deg, #0f2027 0%, #0d4f47 50%, #0d9488 100%);
  border-radius: 24px;
  padding: 4rem 2rem;
  overflow: hidden;
}
.cta-glow {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 30% 50%, rgba(13,148,136,0.4) 0%, transparent 60%),
                    radial-gradient(circle at 70% 30%, rgba(124,58,237,0.25) 0%, transparent 50%);
}
.cta-btn-white {
  background: white;
  color: #0d9488;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.cta-btn-white:hover { background: #f0fdfa; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.cta-btn-outline {
  background: transparent;
  color: white;
  border: 2px solid rgba(255,255,255,0.4);
  padding: 0.85rem 2rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.cta-btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); transform: translateY(-2px); }
</style>