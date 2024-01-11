<script setup lang="ts">
import PageMain from '@/components/PageMain/index.vue'
const ruleInfo = reactive<any>({
  title: '',
  rules: [],
})
</script>

<template>
  <PageMain :has-search="false">
    <template #pageBody>
      <div class="rule-main">
        <div class="web-box">
          <div
            style="
              background: #262d34;
              color: rgba(255, 255, 255, 0.6);
              font-size: 14px;
              padding: 24px;
            "
          >
            <div>{{ ruleInfo.title }}</div>
            <template v-for="(rule, index) in ruleInfo.rules" :key="index">
              <div
                style="
                  display: flex;
                  align-items: center;
                  color: #fff;
                  font-size: 16px;
                "
              >
                <div
                  style="
                    width: 24px;
                    line-height: 24px;
                    text-align: center;
                    border-radius: 8px;
                    flex-shrink: 0;
                    background: #000;
                    margin-right: 12px;
                  "
                >
                  1
                </div>
                <div>{{ rule.title }}</div>
              </div>
              <!-- <div v-if="r in (rule.rs || [])" :key="r" style="padding: 14px 14px 14px 40px">
                {{ r }}
              </div> -->
            </template>
          </div>
        </div>
        <div class="wap-box">
          //
        </div>
      </div>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.rule-main {
  display: flex;
  height: 800px;
}
</style>
