<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-50 w-full border-b border-border bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/60">
      <div class="container mx-auto flex h-16 items-center px-4">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <img src="/pwndoc-logo-white.png" alt="PwnDoc" class="h-8 w-auto">
        </div>

        <!-- Navigation -->
        <nav class="ml-8 hidden items-center space-x-1 md:flex">
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/audits') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/audits')"
          >
            <Shield class="mr-2 size-4" />
            {{ $t('nav.audits') }}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            :class="[
              'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/vulnerabilities') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/vulnerabilities')"
          >
            <ShieldAlert class="mr-2 size-4" />
            {{ $t('nav.vulnerabilities') }}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            :class="[
              'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/data') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/data/collaborators')"
          >
            <Database class="mr-2 size-4" />
            {{ $t('nav.data') }}
          </Button>
        </nav>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Settings and User Menu -->
        <div class="flex items-center space-x-2">
          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- Settings Button -->
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/settings') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/settings')"
          >
            <Settings class="mr-2 size-4" />
            {{ $t('settings') }}
          </Button>

          <!-- User Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <User class="mr-2 size-4" />
                {{ userService.user.username }}
                <ChevronDown class="ml-1 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem @click="$router.push('/profile')">
                <UserCircle class="mr-2 size-4" />
                {{ $t('profile') }}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem class="text-destructive focus:text-destructive" @click="logout">
                <LogOut class="mr-2 size-4" />
                {{ $t('logout') }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Mobile Menu Button -->
          <Button
            variant="ghost"
            size="sm"
            class="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground md:hidden"
            @click="showMobileMenu = !showMobileMenu"
          >
            <Menu class="size-4" />
          </Button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="border-t border-primary-foreground/10 bg-primary md:hidden">
        <div class="container mx-auto space-y-1 px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            :class="[
              'w-full justify-start text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/audits') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/audits'); showMobileMenu = false"
          >
            <Shield class="mr-2 size-4" />
            {{ $t('nav.audits') }}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            :class="[
              'w-full justify-start text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/vulnerabilities') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/vulnerabilities'); showMobileMenu = false"
          >
            <ShieldAlert class="mr-2 size-4" />
            {{ $t('nav.vulnerabilities') }}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            :class="[
              'w-full justify-start text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground',
              $route.path.startsWith('/data') ? 'bg-primary-foreground/10' : ''
            ]"
            @click="$router.push('/data/collaborators'); showMobileMenu = false"
          >
            <Database class="mr-2 size-4" />
            {{ $t('nav.data') }}
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Components
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import ThemeToggle from '@/components/ui/theme-toggle.vue'

// Icons
import {
  Shield,
  ShieldAlert,
  Database,
  Settings,
  User,
  UserCircle,
  ChevronDown,
  Menu,
  LogOut,
} from 'lucide-vue-next'

// Services
import UserService from '@/services/user'

// Composables
import { $t } from '@/boot/i18n'

const route = useRoute()
const router = useRouter()

// Reactive data
const showMobileMenu = ref(false)
const userService = UserService

// Methods
const logout = () => {
  UserService.destroyToken()
  router.push('/login')
}

// Close mobile menu on route change
router.beforeEach(() => {
  showMobileMenu.value = false
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Custom scrollbar for mobile menu */
.space-y-1 > * + * {
  margin-top: 0.25rem;
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(0)) {
  .supports-\[backdrop-filter\]\:bg-primary\/60 {
    backdrop-filter: blur(8px);
  }
}
</style>
