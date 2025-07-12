<template>
  <div :class="isDark ? '' : 'login-background'" class="flex min-h-screen items-center justify-center">
    <div v-if="loaded === true">
      <Card class="w-[350px] text-center">
        <CardContent class="p-6">
          <img
            :src="isDark ? 'pwndoc-logo-white.png' : 'pwndoc-logo.png'"
            alt="PwnDoc Logo"
            class="mx-auto mb-4"
          >
        </CardContent>

        <CardContent v-if="errors.alert" class="p-6 pt-0">
          <Alert variant="destructive">
            <AlertTriangle class="size-4" />
            {{ errors.alert }}
          </Alert>
        </CardContent>

        <div v-if="init">
          <CardContent class="space-y-4 p-6">
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('username') }}</label>
              <Input
                v-model="username"
                :error="!!errors.username"
                :error-message="errors.username"
                autofocus
                @keyup.enter="initUser()"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('firstname') }}</label>
              <Input
                v-model="firstname"
                :error="!!errors.firstname"
                :error-message="errors.firstname"
                @keyup.enter="initUser()"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('lastname') }}</label>
              <Input
                v-model="lastname"
                :error="!!errors.lastname"
                :error-message="errors.lastname"
                @keyup.enter="initUser()"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('password') }}</label>
              <Input
                ref="pwdInitRef"
                v-model="password"
                :error="!!errors.password"
                :error-message="errors.password"
                type="password"
                @keyup.enter="initUser()"
              />
            </div>

            <Button
              variant="default"
              class="w-full"
              @click="initUser()"
            >
              {{ $t('registerFirstUser') }}
            </Button>
          </CardContent>
        </div>

        <div v-else>
          <CardContent v-show="step === 0" class="space-y-4 p-6">
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('username') }}</label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  v-model="username"
                  :error="!!errors.username"
                  :error-message="errors.username"
                  autofocus
                  :disabled="loginLoading"
                  class="pl-10"
                  @keyup.enter="getToken()"
                />
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">{{ $t('password') }}</label>
              <div class="relative">
                <Key class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  v-model="password"
                  :error="!!errors.password"
                  :error-message="errors.password"
                  type="password"
                  :disabled="loginLoading"
                  class="pl-10"
                  @keyup.enter="getToken()"
                />
              </div>
            </div>
          </CardContent>
          <CardContent v-show="step === 1" class="space-y-4 p-6">
            <div class="mb-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                class="p-1"
                @click="step=0;totpToken=''"
              >
                <ArrowLeft class="size-4" />
                <span class="sr-only">{{ $t('goBack') }}</span>
              </Button>
              <h6 class="flex-1 text-center text-lg font-semibold">
                {{ $t('twoStepVerification') }}
              </h6>
            </div>
            <div class="mb-4 flex items-start gap-4">
              <Smartphone class="mt-2 size-16 text-muted-foreground" />
              <div class="flex-1">
                <p class="text-sm text-muted-foreground">
                  {{ $t('twoStepVerificationMessage') }}
                </p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="relative">
                <Unlock class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref="totptoken"
                  v-model="totpToken"
                  placeholder="Enter 6-digit code"
                  maxlength="6"
                  :disabled="loginLoading"
                  class="pl-10"
                  @keyup.enter="getToken()"
                />
              </div>
            </div>
          </CardContent>

          <CardContent class="p-6 pt-0">
            <Button
              :loading="loginLoading"
              variant="default"
              class="w-full"
              @click="getToken()"
            >
              {{ $t('login') }}
            </Button>
          </CardContent>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, computed } from 'vue'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import {
  User,
  Key,
  ArrowLeft,
  Smartphone,
  Unlock,
  AlertTriangle,
} from 'lucide-vue-next'

import { globalLoading } from '@/composables/useLoading'
import { useTheme } from '@/composables/useTheme'
import UserService from '@/services/user'
import Utils from '@/services/utils'

import { $t } from '@/boot/i18n'

export default defineComponent({
  components: {
    Card,
    CardContent,
    Input,
    Button,
    Alert,
    User,
    Key,
    ArrowLeft,
    Smartphone,
    Unlock,
    AlertTriangle,
  },

  setup() {
    const { isDark } = useTheme()
    return {
      isDark,
    }
  },

  data () {
    return {
      init: false,
      loaded: false,
      username: '',
      firstname: '',
      lastname: '',
      password: '',
      totpToken: '',
      step: 0,
      errors: { alert: '', username: '', password: '', firstname: '', lastname: '' },
      loginLoading: false,
    }
  },

  created() {
    if (this.$route.query.tokenError)
      if (this.$route.query.tokenError === '2') this.errors.alert = $t('err.expiredToken')
      else this.errors.alert = $t('err.invalidToken')
    this.checkInit()
  },

  methods: {

    cleanErrors() {
      this.errors.alert = ''
      this.errors.username = ''
      this.errors.firstname = ''
      this.errors.lastname = ''
      this.errors.password = ''
    },

    checkInit() {
      globalLoading.show({ message: $t('msg.tryingToContactBackend'), customClass: 'loading', backgroundColor: 'blue-grey-8' })
      UserService.isInit()
        .then((data) => {
          globalLoading.hide()
          this.loaded = true
          this.init = data.data.datas
        })
        .catch(err => {
          globalLoading.show({
            message: `<i class='material-icons'>wifi_off</i><br /><p>${$t('msg.wrongContactingBackend')}</p>`,
            backgroundColor: 'red-10',
            html: true,
            customClass: 'loading-error' })
          console.log(err)
        })
    },

    initUser() {
      this.cleanErrors()
      if (!this.username)
        this.errors.username = $t('msg.usernameRequired')
      if (!Utils.strongPassword(this.password))
        this.errors.password = $t('msg.passwordComplexity')
      if (!this.password)
        this.errors.password = $t('msg.passwordRequired')
      if (!this.firstname)
        this.errors.firstname = $t('msg.firstnameRequired')
      if (!this.lastname)
        this.errors.lastname = $t('msg.lastnameRequired')

      if (this.errors.username || this.errors.password || this.errors.firstname || this.errors.lastname)
        return

      UserService.initUser(this.username, this.firstname, this.lastname, this.password)
        .then(async () => {
          await this.$settings.refresh()
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err)
          this.errors.alert = err.response.data.datas
        })
    },

    getToken() {
      this.cleanErrors()
      if (!this.username)
        this.errors.username = $t('msg.usernameRequired')
      if (!this.password)
        this.errors.password = $t('msg.passwordRequired')

      if (this.errors.username || this.errors.password)
        return

      this.loginLoading = true
      UserService.getToken(this.username, this.password, this.totpToken)
        .then(async () => {
          await this.$settings.refresh()
          this.$router.push('/')
        })
        .catch(err => {
          if (err.response.status === 422) {
            this.step = 1
            nextTick(() => {
              this.$refs.totptoken.focus()
            })
          }
          else {
            let errmsg = $t('err.invalidCredentials')
            if (err.response.data.datas)
              errmsg = err.response.data.datas
            this.errors.alert = errmsg
          }
        })
        .finally(() => {
          this.loginLoading = false
        })
    },
  },
})
</script>

<style lang="stylus">
.login-background {
    background: linear-gradient(45deg, $blue, transparent)
}

.loading p {
    font-size: 20px;
}
</style>
