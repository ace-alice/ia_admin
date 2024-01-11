<route lang="yaml">
name: playManage
meta:
  title: 玩法管理
  constant: false
  layout: true
</route>

<script lang="ts" setup name="playManage">
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import {
  otherPermission,
  tablePermission,
  toolPermission,
} from './hooks/permission'
import BindPlay from './components/BindPlay.vue'
import UploadLogo from './components/UploadLogo.vue'
import { parseTime } from '@/utils/formatTime'
import PageMain from '@/components/PageMain/index.vue'
import CRUD from '@/components/Crud'
import type { CrudOptionsType } from '@/components/Crud/lib/interface'
import Api from '@/api/match-data-manage/play-manage'
import { dictionary } from '@/hooks/lib'
import PromiseSwitch from '@/components/PromiseSwitch/index.vue'
import visibleColumn from '@/hooks/visibleColumn'
import FilterColumnControl from '@/components/FilterColumnControl/index.vue'
import getGameListHook from '@/hooks/getGameListHook'

const defaultCrudOptions: CrudOptionsType = {
  crudTitle: '玩法管理',
  crudOptShow: {
    add: true,
    formSize: '50%',
  },
  defaultQuery: {
    play_name: null,
    is_del: null,
    game_id: null,
  },
  crudMethod: { ...Api },
  defaultForm: {
    id: null,
    play_name_cn: null,
    play_name_en: null,
    play_name_tw: null,
    play_name_th: null,
    play_name_vn: null,
    play_name_in: null,
    game_id: null,
    create_user: null,
    create_time: null,
    update_user: null,
    update_time: null,
    is_time: null,
    is_del: null,
    sort: null,
    introduction: null,
    ext_type: null,
    ext_cn: null,
    ext_en: null,
    ext_tw: null,
    ext_th: null,
    ext_vn: null,
    ext_in: null,
    level_config: null,
    level_config_arr: [],
    unit_cn: null,
    unit_en: null,
    unit_tw: null,
    unit_th: null,
    unit_vn: null,
    unit_in: null,
    play_name_jp: null,
    ext_jp: null,
    unit_jp: null,
    play_name_kr: null,
    ext_kr: null,
    unit_kr: null,
    rule_id_str: [],
    default_fix_point_id: null,
    auto_team_name: null,
    play_related_show: null,
    is_fast: null,
    is_multi_simple: null,
    is_auto_settle: null,
    is_special: null,
    payout_scale: null,
    competition_level: null,
    play_name: null,
    create_username: null,
    update_username: null,
    rule_id_arr: [],
  },
  crudTag: 'play:manage:',
}

const {
  crudQuery,
  crudData,
  crudPage,
  refresh,
  toQuery,
  queryLoading,
  changeStatus,
  crudStatus,
  toAdd,
  resetCrudStatus,
  dialogVisible,
  submitHandle,
  crudOptShow,
  crudDefaultFormRef,
  proxyForm,
  toEdit,
  reQuery,
} = CRUD(defaultCrudOptions)

const { tableRef, filterHeaderColumn, columnInfo, getColumnShow }
  = visibleColumn()

const { isDisableOptions, isNot } = dictionary()

const { gameList, getGameTypeName } = getGameListHook(false, false)

const { proxy }: any = getCurrentInstance()

function toBindTeam(row: any) {
  proxy.mittBus.emit('teamBindPlayBus', row)
}
// 特殊盘口
const extOptions: any = []
let ruleOptions: any = []
const descOptions: any = []
const checkList: any = ref([])
const getExtOption = () => {
  Api.getSpecialHandicap().then((res: any) => {
    if (res && res.code === 1) {
      const data = res.data
      Object.keys(data).forEach((k: any, v: any) => {
        const obj = {
          value: Number(k),
          label: data[k],
        }
        extOptions.push(obj)
      })
    }
  })
}
const getPlayRule = () => {
  Api.getPlayRule().then((res: any) => {
    if (res && res.code === 1) {
      ruleOptions = res.data
    }
  })
}
const getAssicDesc = () => {
  Api.getRelatedInfo().then((res: any) => {
    if (res && res.code === 1) {
      const data = res.data
      Object.keys(data).forEach((k: any, v: any) => {
        const obj = {
          value: Number(k),
          label: data[k],
        }
        descOptions.push(obj)
      })
    }
  })
}
onMounted(() => {
  getExtOption()
  getPlayRule()
  getAssicDesc()
})
</script>

<template>
  <PageMain
    :title="$t('router.play-manage')"
    :has-tool="true"
    :has-footer="true"
  >
    <template #searchBox>
      <el-form :inline="true" :model="crudQuery" label-width="120px">
        <el-form-item :label="$t('table.game_name')" prop="game_name">
          <el-select
            v-model="crudQuery.game_id"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
            filterable
          >
            <el-option
              v-for="item in gameList"
              :key="item.id"
              :label="item.game_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.is_disable')" prop="is_disable">
          <el-select
            v-model="crudQuery.is_del"
            style="width: 200px"
            popper-class="user-select"
            :placeholder="$t('lib.all')"
            clearable
          >
            <el-option
              v-for="item in isNot"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.play_name')" prop="play_name">
          <el-input
            v-model="crudQuery.play_name"
            :placeholder="$t('table.play_name')"
            style="width: 200px"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="Search"
            :loading="queryLoading"
            @click="toQuery"
          >
            {{ $t("crud.search") }}
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :icon="RefreshRight"
            :loading="queryLoading"
            @click="reQuery"
          >
            {{ $t("crud.reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #pageTool>
      <el-button
        v-only="toolPermission.add"
        type="primary"
        :icon="Plus"
        @click="toAdd"
      >
        {{ $t("crud.add") }}
      </el-button>
    </template>
    <template #pageBody>
      <el-table
        ref="tableRef"
        v-loading="queryLoading"
        :data="crudData"
        stripe
        style="width: 100%"
        height="100%"
        border
        resizable
        :header-cell-style="filterHeaderColumn"
      >
        <el-table-column
          v-if="getColumnShow('id')"
          prop="id"
          :label="$t('table.id')"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('sort')"
          prop="sort"
          :label="$t('table.sort')"
          min-width="80"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_cn')"
          prop="play_name_cn"
          :label="$t('table.game_name_cn')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_tw')"
          prop="play_name_tw"
          :label="$t('table.game_name_tw')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_en')"
          prop="play_name_en"
          :label="$t('table.game_name_en')"
          min-width="130"
          align="center"
        />

        <el-table-column
          v-if="getColumnShow('play_name_th')"
          prop="play_name_th"
          :label="$t('table.game_name_th')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_vn')"
          prop="play_name_vn"
          :label="$t('table.game_name_vn')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_in')"
          prop="play_name_in"
          :label="$t('table.game_name_in')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_jp')"
          prop="play_name_jp"
          :label="$t('table.game_name_jp')"
          min-width="150"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('play_name_kr')"
          prop="play_name_kr"
          :label="$t('table.game_name_kr')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('game_name')"
          prop="game_name"
          :label="$t('table.game_name')"
          min-width="130"
          align="center"
        >
          <template #default="scope">
            {{ getGameTypeName(+scope.row.game_id) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('update_user')"
          prop="update_username"
          :label="$t('table.action_name')"
          min-width="130"
          align="center"
        />
        <el-table-column
          v-if="getColumnShow('update_time')"
          prop="update_time"
          :label="$t('table.update_time1')"
          min-width="190"
          align="center"
        >
          <template #default="scope">
            <span v-if="scope.row.update_time">{{
              parseTime(scope.row.update_time)
            }}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_del')"
          prop="is_del"
          :label="$t('table.is_disable')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_del"
              :options="isDisableOptions"
              :default-param="{
                id: scope.row.id,
                del: scope.row.is_del,
              }"
              param-key="del"
              :change-fun="changeStatus"
              emit-fun-name="isDisable"
              :permission="tablePermission.is_disable"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_fast')"
          prop="is_fast"
          :label="$t('table.is_fast')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_fast"
              :options="isNot"
              :default-param="{
                id: scope.row.id,
                is_fast: scope.row.is_fast,
              }"
              param-key="is_fast"
              :change-fun="changeStatus"
              emit-fun-name="isFast"
              :permission="tablePermission.is_quick"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="getColumnShow('is_special')"
          prop="is_special"
          :label="$t('table.is_special')"
          width="150"
          align="center"
          fixed="right"
        >
          <template #default="scope">
            <PromiseSwitch
              :key="scope.row.id"
              :init-value="scope.row.is_special"
              :options="isNot"
              :default-param="{
                id: scope.row.id,
                is_special: scope.row.is_special,
              }"
              param-key="is_special"
              :change-fun="changeStatus"
              emit-fun-name="isSpecial"
              :permission="tablePermission.is_special"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.operate')"
          width="120"
          align="center"
          fixed="right"
        >
          <template #header>
            <FilterColumnControl :column-info="columnInfo" />
          </template>
          <template #default="scope">
            <span v-some="Object.values(otherPermission)">
              <el-dropdown
                placement="bottom-end"
                :hide-on-click="false"
                trigger="click"
              >
                <el-button type="warning" link>
                  {{ $t("table.operateControl") }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.edit"
                      type="primary"
                      size="small"
                      @click="toEdit(scope.row)"
                    >
                      {{ $t("crud.edit") }}
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.bindPlay"
                      type="primary"
                      size="small"
                      @click="toBindTeam(scope.row)"
                    >
                      {{ $t("table.bind_paly") }}
                    </el-button>
                  </el-dropdown-item>
                  <!-- <el-dropdown-item>
                    <el-button
                      v-only="otherPermission.uploadLogo"
                      type="primary"
                      size="small"
                      @click="toUploadLogo(scope.row)"
                    >
                      {{ $t('table.upload_logo') }}
                    </el-button>
                  </el-dropdown-item> -->
                </template>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pageFooter>
      <el-pagination
        v-model:current-page="crudPage.page"
        v-model:page-size="crudPage.limit"
        :page-sizes="[10, 50, 100, 500, 1000]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="crudPage.count"
        @size-change="refresh"
        @current-change="refresh"
      />
    </template>
    <template #other>
      <el-dialog
        v-model="dialogVisible"
        :title="crudStatus.title"
        :before-close="resetCrudStatus"
        :width="crudOptShow.formSize"
      >
        <el-form
          ref="crudDefaultFormRef"
          :model="proxyForm"
          label-width="160px"
          class="demo-ruleForm"
          inline
        >
          <el-form-item :label="$t('table.is_disable')" prop="is_disable">
            <el-switch
              v-model="proxyForm.is_del"
              style="width: 220px"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name')"
            prop="game_id"
            :rules="[
              {
                required: true,
                message: $t('table.game_name') + $t('table.not_empty'),
              },
            ]"
          >
            <el-select
              v-model="proxyForm.game_id"
              style="width: 220px"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
              clearable
              filterable
            >
              <el-option
                v-for="item in gameList"
                :key="item.id"
                :label="item.game_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_cn')"
            prop="play_name_cn"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_cn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_cn"
              :placeholder="$t('table.game_name_cn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_en')"
            prop="play_name_en"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_en') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_en"
              :placeholder="$t('table.game_name_en')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_tw')"
            prop="play_name_tw"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_tw') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_tw"
              :placeholder="$t('table.game_name_tw')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_th')"
            prop="play_name_th"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_th') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_th"
              :placeholder="$t('table.game_name_th')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_vn')"
            prop="play_name_vn"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_vn') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_vn"
              :placeholder="$t('table.game_name_vn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_in')"
            prop="play_name_in"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_in') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_in"
              :placeholder="$t('table.game_name_in')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_jp')"
            prop="play_name_jp"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_jp') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_jp"
              :placeholder="$t('table.game_name_jp')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.game_name_kr')"
            prop="play_name_kr"
            :rules="[
              {
                required: true,
                message: $t('table.game_name_kr') + $t('table.not_empty'),
              },
            ]"
          >
            <el-input
              v-model="proxyForm.play_name_kr"
              :placeholder="$t('table.game_name_kr')"
              style="width: 220px"
              clearable
            />
          </el-form-item>

          <el-form-item :label="$t('table.ext_cn')" prop="ext_cn">
            <el-input
              v-model="proxyForm.ext_cn"
              :placeholder="$t('table.ext_cn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_en')" prop="ext_en">
            <el-input
              v-model="proxyForm.ext_en"
              :placeholder="$t('table.ext_en')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_tw')" prop="ext_tw">
            <el-input
              v-model="proxyForm.ext_tw"
              :placeholder="$t('table.ext_tw')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_th')" prop="ext_th">
            <el-input
              v-model="proxyForm.ext_th"
              :placeholder="$t('table.ext_th')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_vn')" prop="ext_vn">
            <el-input
              v-model="proxyForm.ext_vn"
              :placeholder="$t('table.ext_vn')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_in')" prop="ext_in">
            <el-input
              v-model="proxyForm.ext_in"
              :placeholder="$t('table.ext_in')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_jp')" prop="ext_jp">
            <el-input
              v-model="proxyForm.ext_jp"
              :placeholder="$t('table.ext_jp')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.ext_kr')" prop="ext_kr">
            <el-input
              v-model="proxyForm.ext_kr"
              :placeholder="$t('table.ext_kr')"
              style="width: 220px"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="$t('table.special_handicap' /**特殊盘口 */)"
            prop="ext_type"
          >
            <el-radio-group v-model="proxyForm.ext_type">
              <el-radio
                v-for="item in extOptions"
                :key="item.value"
                :label="item.value"
                size="large"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('table.rule_play' /**玩法规则 */)"
            prop="rule_id_str"
          >
            <el-checkbox-group v-model="proxyForm.rule_id_str">
              <el-checkbox
                v-for="item in ruleOptions"
                :key="item.id"
                :label="item.id"
              >
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            :label="$t('table.is_auto_settle' /**是否自动结算 */)"
            prop="is_auto_settle"
          >
            <el-radio-group v-model="proxyForm.is_auto_settle">
              <el-radio
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
                size="large"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('table.is_multiple_handicap' /**是否多选项的独赢玩法 */)"
            prop="is_multi_simple"
          >
            <el-radio-group v-model="proxyForm.is_multi_simple">
              <el-radio
                v-for="item in isNot"
                :key="item.value"
                :label="item.value"
                size="large"
              >
                {{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            :label="$t('table.asste_desc' /**关联描述 */)"
            prop="play_related_show"
            style="width: 100%"
          >
            <el-select
              v-model="proxyForm.play_related_show"
              style="width: 360px"
              popper-class="user-select"
              :placeholder="$t('lib.all')"
              clearable
              filterable
            >
              <el-option
                v-for="item in descOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            :label="$t('table.sort')"
            prop="sort"
            style="width: 100%"
          >
            <el-input-number
              v-model="proxyForm.sort"
              :placeholder="$t('table.sort')"
              :min="0"
              step-strictly
              :step="1"
              style="width: 360px"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('table.intro')" prop="introduction">
            <el-input
              v-model="proxyForm.introduction"
              :placeholder="$t('table.intro')"
              :rows="4"
              type="textarea"
              style="width: 360px"
              clearable
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="resetCrudStatus">
              {{ $t("crud.cancel") }}
            </el-button>
            <el-button type="primary" @click="submitHandle">
              {{ $t("crud.sure") }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <BindPlay />
      <UploadLogo @refresh="refresh" />
    </template>
  </PageMain>
</template>
