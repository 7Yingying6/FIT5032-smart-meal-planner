<template>
  <div class="email-sender card shadow-sm">
    <div class="card-header bg-light d-flex justify-content-between align-items-center">
      <h5 class="mb-0 d-flex align-items-center text-nowrap">
        <Icon icon="mdi:email-send-outline" class="me-2" />Send Shopping List
      </h5>
      <div>
        <slot name="header-actions"></slot>
      </div>
    </div>
    <div class="card-body">
      <div class="row g-3 align-items-center">
        <div class="col-12">
          <label for="toEmail" class="form-label">Recipient Email</label>
          <input 
            id="toEmail" 
            type="email" 
            class="form-control" 
            v-model="toEmail" 
            placeholder="e.g. student@example.com" 
            required
          />
        </div>
        <div class="col-12">
          <button 
            class="btn btn-success btn-lg w-100 text-nowrap" 
            :disabled="sending || !toEmail" 
            @click="handleSend"
            title="Send shopping list via EmailJS"
          >
            <Icon :icon="sending ? 'mdi:loading' : 'mdi:send'" class="me-2" :class="{ 'icon-spin': sending }" />
            {{ sending ? 'Sending...' : 'Click to send it' }}
          </button>
        </div>
      </div>

      <div class="mt-3" v-if="message">
        <div :class="['alert', status === 'success' ? 'alert-success' : 'alert-danger']" role="alert">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue'
import emailjs from '@emailjs/browser'

export default {
  name: 'EmailSender',
  components: { Icon },
  props: {
    user: { type: Object, default: null },
    replyTo: { type: String, default: '' },
    userName: { type: String, default: '' },
    weekRange: { type: String, default: '' },
    generatedAt: { type: String, default: () => new Date().toISOString() },
    shoppingItemsCount: { type: Number, default: 0 },
    estimatedBudget: { type: String, default: '' },
    shoppingHtml: { type: String, default: '' },
    planId: { type: String, default: '' },
    unsubscribeToken: { type: String, default: '' }
  },
  data() {
    return {
      toEmail: '',
      sending: false,
      status: '', // 'success' | 'error'
      message: ''
    }
  },
  computed: {
    // Fallbacks derived from user and local saved plan
    fallbackReplyTo() {
      return this.replyTo || this.user?.email || ''
    },
    fallbackUserName() {
      if (this.userName) return this.userName
      if (this.user?.name) return this.user.name
      const first = this.user?.firstName || ''
      const last = this.user?.lastName || ''
      if (first || last) return `${first} ${last}`.trim()
      return 'User'
    },
    fallbackWeekRange() {
      if (this.weekRange) return this.weekRange
      const start = new Date()
      const end = new Date(start)
      end.setDate(start.getDate() + 4)
      const fmt = d => d.toISOString().slice(0,10)
      return `${fmt(start)} ~ ${fmt(end)}`
    },
    fallbackGeneratedAt() {
      return this.generatedAt || new Date().toISOString()
    },
    // Read from saved plan if props were not provided
    savedPlan() {
      try {
        const raw = localStorage.getItem('savedMealPlan')
        return raw ? JSON.parse(raw) : null
      } catch { return null }
    },
    fallbackShoppingItems() {
      const meals = this.savedPlan?.mealPlan || []
      const ingredients = new Set()
      meals.forEach(m => (m.ingredients || []).forEach(i => ingredients.add(i)))
      return Array.from(ingredients).sort()
    },
    fallbackShoppingItemsCount() {
      return this.shoppingItemsCount || this.fallbackShoppingItems.length
    },
    fallbackShoppingHtml() {
      if (this.shoppingHtml) return this.shoppingHtml
      const items = this.fallbackShoppingItems.map(i => `<li>${i}</li>`).join('')
      return `<ul>${items}</ul>`
    },
    fallbackEstimatedBudget() {
      return this.estimatedBudget || '$0.00'
    },
    fallbackPlanId() {
      if (this.planId) return this.planId
      const firstId = this.savedPlan?.mealPlan?.[0]?.id || 'plan'
      return `${firstId}-${new Date().toISOString().slice(0,10)}`
    },
    fallbackUnsubscribeToken() {
      return this.unsubscribeToken || btoa(`unsubscribe:${this.fallbackPlanId}`)
    },
    emailSubject() {
      const wk = this.fallbackWeekRange
      const id = this.fallbackPlanId
      return `Weekly Shopping List (${wk}) - Plan ${id}`
    }
  },
  mounted() {
    // Initialize EmailJS with public key to ensure consistent behavior across versions
    try {
      const PUBLIC_KEY = 'QEsirt9cSGMLuXzD2'
      emailjs.init(PUBLIC_KEY)
    } catch {}
  },
  methods: {
    async sendShoppingList() {
      this.sending = true
      this.status = ''
      this.message = ''
      try {
        const templateParams = {
          to_email: this.toEmail,
          to: this.toEmail,
          to_name: this.toEmail,
          reply_to: this.fallbackReplyTo,
          from_name: this.fallbackUserName || 'NutriPlanner',
          user_name: this.fallbackUserName,
          subject: this.emailSubject,
          week_range: this.fallbackWeekRange,
          generated_at: this.fallbackGeneratedAt,
          shopping_items_count: String(this.fallbackShoppingItemsCount),
          estimated_budget: this.fallbackEstimatedBudget,
          shopping_html: this.fallbackShoppingHtml,
          shopping_text: this.fallbackShoppingItems.join(', '),
          plan_id: this.fallbackPlanId,
          unsubscribe_token: this.fallbackUnsubscribeToken
        }
        const SERVICE_ID = 'service_8xfzt6r'
        const TEMPLATE_ID = 'template_sb3qsto'
        const PUBLIC_KEY = 'QEsirt9cSGMLuXzD2'
        const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY })
        if (result && result.status === 200) {
          this.status = 'success'
          this.message = 'Email sent successfully!'
          this.toEmail = ''
        } else {
          this.status = 'error'
          this.message = 'Failed to send email, please check template settings.'
        }
      } catch (err) {
        this.status = 'error'
        const detail = err?.text || err?.message || ''
        this.message = detail ? `Failed to send email: ${detail}` : 'Failed to send email, please try again.'
      } finally {
        this.sending = false
      }
    },
    handleSend() {
      const email = (this.toEmail || '').trim()
      if (!email || !email.includes('@')) {
        this.status = 'error'
        this.message = 'Please enter a valid recipient email.'
        return
      }
      this.sendShoppingList()
    }
  }
}
</script>

<style scoped>
.email-sender { max-width: 420px; }
.email-sender .card-header { border-bottom: 1px solid var(--border-color); }
.icon-spin { animation: icon-rotate 1s linear infinite; }
@keyframes icon-rotate { 100% { transform: rotate(360deg); } }
</style>