import { ref } from 'vue'
import type { Session } from '@supabase/supabase-js'

const userSession = ref<Session | null>(null)

export {
  userSession,
}