<route lang="yaml">
meta:
  title: 登录
  constant: true
  layout: false
</route>

<script lang="ts" setup name="Login">
import type { FormInstance, FormRules } from 'element-plus'
import { PictureFilled, SetUp } from '@element-plus/icons-vue'
import useUserStore from '@/store/modules/user'
import { getCodeImg } from '@/api/global/login'

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()

const banner = new URL('@/assets/images/login-banner.png', import.meta.url).href
const title = computed(() => {
  return userStore.systemInfo.system_name || import.meta.env.VITE_APP_TITLE
})

// 表单类型，login 登录，reset 重置密码
const formType = ref('login')
const loading = ref(false)
const redirect = ref(route.query.redirect?.toString() ?? '/')

// 登录
const loginFormRef = ref<FormInstance>()
const loginForm = ref({
  username: localStorage.username || '',
  captcha_id: '',
  password: '',
  captcha_code: '',
})
const loginRules = ref<FormRules>({
  username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
  password: [
    { required: true, trigger: 'blur', message: '请输入密码' },
    { min: 6, max: 18, trigger: 'blur', message: '密码长度为6到18位' },
  ],
  captcha_code: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
})
function handleLogin() {
  loginFormRef.value
    && loginFormRef.value.validate((valid) => {
      if (valid) {
        loading.value = true
        userStore
          .login(loginForm.value)
          .then((res: any) => {
            if (res) {
              router.push(redirect.value)
            }
            else {
              toGetCodeImg()
            }
          })
          .finally(() => (loading.value = false))
      }
    })
}

const captchaSwitch = computed(() => {
  return !!userStore.systemInfo.captcha_switch
})

const captchaSrc = ref('')

const captchaLoading = ref(false)

function toGetCodeImg() {
  captchaLoading.value = true
  loginForm.value.captcha_code = ''
  getCodeImg()
    .then((res: any) => {
      if (+res.code === 1) {
        loginForm.value.captcha_id = res.data.captcha_id
        captchaSrc.value = res.data.captcha_src
      }
    })
    .finally(() => (captchaLoading.value = false))
}

onMounted(() => {
  toGetCodeImg()
})
</script>

<template>
  <div>
    <div class="bg-banner" />
    <div id="login-box">
      <div class="login-banner">
        <div class="logo" />
        <img :src="banner" class="banner">
      </div>
      <el-form
        v-show="formType === 'login'"
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
      >
        <div class="title-container">
          <h3 class="title">
            欢迎来到 {{ title }} ! 👋🏻
          </h3>
        </div>
        <div>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名"
              text
              tabindex="1"
              autocomplete="on"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:user" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              tabindex="2"
              autocomplete="on"
              show-password
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon>
                  <svg-icon name="ep:lock" />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-if="captchaSwitch" prop="captcha_code">
            <el-input
              v-model="loginForm.captcha_code"
              placeholder="验证码"
              tabindex="3"
              autocomplete="on"
              text
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <el-icon><SetUp /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item v-loading="captchaLoading" @click="toGetCodeImg">
            <el-image class="captcha-code" :src="captchaSrc">
              <template #error>
                <div class="image-slot">
                  <el-icon><PictureFilled /></el-icon>
                </div>
              </template>
            </el-image>
          </el-form-item>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          style="width: 100%;"
          @click.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.captcha-code {
  width: 400px;
  height: 120px;
  margin: 0 auto 16px;
  display: block;

  .image-slot {
    line-height: 120px;
    text-align: center;
  }
}

[data-mode="mobile"] {
  #login-box {
    position: relative;
    width: 100%;
    height: 100%;
    top: inherit;
    left: inherit;
    transform: translateX(0) translateY(0);
    flex-direction: column;
    justify-content: start;
    border-radius: 0;
    box-shadow: none;

    .login-banner {
      width: 100%;
      padding: 20px 0;

      .banner {
        position: relative;
        right: inherit;
        width: 100%;
        max-width: 375px;
        margin: 0 auto;
        display: inherit;
        top: inherit;
        transform: translateY(0);
      }
    }

    .login-form {
      width: 100%;
      min-height: auto;
      padding: 30px;
    }
  }
}

:deep(input[type="password"]::-ms-reveal) {
  display: none;
}

.bg-banner {
  position: fixed;
  z-index: 0;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      circle at center,
      var(--el-fill-color-lighter),
      var(--el-bg-color-page)
    );
}

#login-box {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background-color: var(--el-bg-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow);

  .login-banner {
    position: relative;
    width: 450px;
    background-color: var(--el-fill-color-light);
    overflow: hidden;

    .banner {
      width: 100%;

      @include position-center(y);
    }

    .logo {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      background: url("../../assets/images/logo-single.png") no-repeat;
      background-size: contain;
      box-shadow: var(--el-box-shadow-light);
    }
  }

  .login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 500px;
    width: 500px;
    padding: 50px;
    overflow: hidden;

    .title-container {
      position: relative;

      .title {
        font-size: 1.3em;
        color: var(--el-text-color-primary);
        margin: 0 auto 30px;
        font-weight: bold;
      }
    }
  }

  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      height: 48px;
      line-height: inherit;
      width: 100%;

      input {
        height: 48px;
      }

      .el-input__prefix,
      .el-input__suffix {
        display: flex;
        align-items: center;
      }

      .el-input__prefix {
        left: 10px;
      }

      .el-input__suffix {
        right: 10px;
      }
    }
  }

  .flex-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .sub-link {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    font-size: 14px;
    color: var(--el-text-color-secondary);

    .text {
      margin-right: 10px;
    }
  }
}
</style>
