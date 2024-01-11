<route lang="yaml">
name: defaultSetting
meta:
  title: 默认配置
  constant: false
  layout: true
</route>

<script lang="ts" setup>
import { otherPermission } from './hooks/permission'
import defaultSetHook from './hooks/defaultSetHook'
import PageMain from '@/components/PageMain/index.vue'
import getGameListHook from '@/hooks/getGameListHook'

const { gameList, getGameTypeName } = getGameListHook(false, false)
const {
  gameId,
  level,
  levelOption,
  eventList,
  checkedCities,
  playList,
  eventSelect,
  changePlaySelect,
  getPageData,
  pageData,
  handleChange,
  reset,
  handleSave,
  submit,
  selectAll,
  liveDefaultRate,
  fixDefaultRate,
  leftDefaultPoint,
  payoutDefaultScale,
  checkAll,
  isIndeterminate,
  handleCheckAllChange,
  fixReturnRateChange,
  defaultFixReturnRateChange,
  defaultliveReturnRateChange,
  defaultpayoutDefaultScaleChange,
} = defaultSetHook()
</script>

<template>
  <PageMain
    :title="$t('router.default-setting')"
    :has-search="false"
    :has-tool="false"
    :has-footer="false"
  >
    <template #pageBody>
      <el-container>
        <el-aside>
          <el-space wrap>
            <el-card class="box-card" style="width: 200px">
              <template #header>
                <div class="card-header">
                  <span>{{ $t("table.game_list" /**游戏列表 */) }}</span>
                </div>
              </template>
              <div
                v-for="game in gameList"
                :key="game"
                class="text-item"
                :class="{ activted: gameId === game.id }"
                @click="handleChange(game.id)"
              >
                {{ game.game_name }}
              </div>
            </el-card>
          </el-space>
        </el-aside>
        <el-main>
          <div class="c-header">
            <el-form :inline="true">
              <el-form-item :label="$t('table.game_type' /**所属游戏 */)">
                <el-input
                  v-model="gameId"
                  style="width: 360px"
                  :value="getGameTypeName(gameId)"
                  disabled
                />
              </el-form-item>
              <el-form-item :label="$t('table.event_leve_name' /**赛事等级 */)">
                <el-select
                  v-model="level"
                  placeholder="Select"
                  style="width: 360px"
                  @change="getPageData"
                >
                  <el-option
                    v-for="item in levelOption"
                    :key="item.id"
                    :label="item.level"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.event_list' /**赛事列表 */)">
                <el-select
                  v-model="eventSelect"
                  multiple
                  value-key="id"
                  collapse-tags
                  collapse-tags-tooltip
                  style="width: 360px"
                  disabled
                >
                  <el-option
                    v-for="item in eventList"
                    :key="item.id"
                    :label="item.event_name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.play_list' /**玩法列表 */)">
                <el-select
                  v-model="checkedCities"
                  multiple
                  filterable
                  value-key="play_id"
                  collapse-tags
                  style="width: 360px"
                  @change="changePlaySelect"
                >
                  <el-option
                    v-for="item in playList"
                    :key="item.play_id"
                    :label="item.play_name"
                    :value="item"
                  >
                    {{ item.play_name }}
                  </el-option>
                </el-select>
                <el-button type="primary" @click="selectAll">
                  {{ $t("table.all_types_game") }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-table
            class="c-table"
            stripe
            style="width: 100%"
            height="100%"
            border
            resizable
            :data="pageData"
          >
            <el-table-column
              :label="$t('table.default_checked') /**默认选中 */"
              min-width="120"
              align="center"
            >
              <template #header>
                {{ $t("table.default_checked") }}
                <el-checkbox
                  v-model="checkAll"
                  :disabled="pageData.length === 0"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                />
              </template>
              <template #default="scope">
                <el-checkbox
                  v-model="scope.row.no_checked"
                  :true-label="1"
                  :false-label="0"
                />
              </template>
            </el-table-column>
            <el-table-column
              prop="play_id"
              label="ID"
              min-width="120"
              align="center"
            />
            <el-table-column
              prop="play_name"
              :label="$t('table.play_name')"
              min-width="120"
              align="center"
            />
            <el-table-column
              :label="$t('table.lf_point')"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-model="scope.row.fix_left_odds"
                  @change="fixReturnRateChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.lr_point' /**右队赔率 */)"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                <el-input v-model="scope.row.fix_right_odds" />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.fix_return_rate' /**早盘返还率 */)"
              min-width="120"
              align="center"
            >
              <template #header>
                {{ $t("table.fix_return_rate") }}
                <el-input-number
                  v-model="fixDefaultRate"
                  :precision="2"
                  :step="0.01"
                  :max="99.99"
                  :min="1"
                  size="small"
                  @change="defaultFixReturnRateChange"
                />
              </template>
              <template #default="scope">
                <el-input
                  v-model="scope.row.fix_return_rate"
                  @change="fixReturnRateChange(scope.row)"
                >
                  <template #append>
                    %
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.live_return_rate' /**滚球返还率 */)"
              min-width="120"
              align="center"
            >
              <template #header>
                {{ $t("table.live_return_rate") }}
                <el-input-number
                  v-model="liveDefaultRate"
                  :precision="2"
                  :step="0.01"
                  :max="99.99"
                  :min="1"
                  size="small"
                  @change="defaultliveReturnRateChange"
                />
              </template>
              <template #default="scope">
                <el-input v-model="scope.row.live_return_rate">
                  <template #append>
                    %
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.payout_ratio' /**赔付占比 */)"
              min-width="120"
              align="center"
            >
              <template #header>
                {{ $t("table.payout_ratio") }}
                <el-input-number
                  v-model="payoutDefaultScale"
                  :precision="2"
                  :step="0.01"
                  :max="100"
                  :min="1"
                  size="small"
                  @change="defaultpayoutDefaultScaleChange"
                />
              </template>
              <template #default="scope">
                <el-input v-model="scope.row.payout_scale">
                  <template #append>
                    %
                  </template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.ball_value' /**球头值 */)"
              min-width="120"
              align="center"
            >
              <template #default="scope">
                <el-input
                  v-if="
                    [1, 3, 4, 5, 10, 11, 12, 13].includes(+scope.row.ext_type)
                  "
                  v-model="scope.row.ball_value"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.operate')"
              width="120"
              align="center"
              fixed="right"
            >
              <template #default="scope">
                <el-button
                  v-only="otherPermission.saveRow"
                  type="primary"
                  size="small"
                  @click="handleSave(scope.row)"
                >
                  {{ $t("crud.save" /**保存 */) }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="c-footer">
            <!-- <el-button @click="reset">
              {{ $t('crud.reset' /**重置 */) }}
            </el-button> -->
            <el-button
              v-only="otherPermission.saveAll"
              type="primary"
              @click="submit"
            >
              {{ $t("crud.saveAll" /**保存全部 */) }}
            </el-button>
          </div>
        </el-main>
      </el-container>
    </template>
  </PageMain>
</template>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  :deep(.el-card__body) {
    padding: 0px;
    max-height: 800px;
    overflow-y: overlay;
    .text-item {
      text-align: center;
      height: 50px;
      line-height: 50px;
      cursor: pointer;
    }
    .activted {
      background: #363637;
    }
  }
}
.el-aside {
  overflow: hidden;
}
.el-main {
  display: flex;
  flex-direction: column;

  .c-header {
    display: flex;
    flex-direction: row;
    width: 100%;
    // min-height: 100px;
    .event-list {
      width: 360px;
      max-width: 660px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      border: 1px solid #414243;
      border-radius: 6px;
      padding-top: 8px;
      min-height: 32px;
      .el-button {
        margin-bottom: 8px;
        margin-left: 5px !important;
      }
    }
  }
  .c-table {
    flex: 1;
    overflow-y: scroll;
  }
  .c-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 50px;
  }
}
</style>
