import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export function dictionary() {
  const i18n = useI18n()

  function getAvatarImg(value: number) {
    return `${value}`
  }

  // 头像列表
  const avatarList = ref([
    { id: 1, url: getAvatarImg(1) },
    { id: 2, url: getAvatarImg(2) },
    { id: 3, url: getAvatarImg(3) },
    { id: 4, url: getAvatarImg(4) },
    { id: 5, url: getAvatarImg(5) },
    { id: 6, url: getAvatarImg(6) },
    { id: 7, url: getAvatarImg(7) },
    { id: 8, url: getAvatarImg(8) },
    { id: 9, url: getAvatarImg(9) },
  ])

  // 根据是否使用值获取label
  function getLabel(
    val: number | string,
    options: Array<any>,
    keyL = 'value',
    nKey = 'label',
  ) {
    const resultArr = options.filter((status: any) => {
      const value
        = status[keyL] || status.value || status.code || status.id || 0
      return value === val
    })
    if (resultArr.length > 0) {
      const result
        = resultArr[0][nKey]
        || resultArr[0].code
        || resultArr[0].value
        || resultArr[0].id
      return result
    }
    else {
      return '--'
    }
  }

  // 是否
  const isNot = ref([
    { label: i18n.t('lib.yes'), value: 1 },
    { label: i18n.t('lib.no'), value: 0 },
  ])
  const enableOption = ref([
    { label: i18n.t('lib.enable'), value: 0 },
    { label: i18n.t('lib.disabled'), value: 1 },
  ])

  // 订单来源
  const orderSource = ref([
    { label: 'PC', code: 1 },
    { label: 'H5', code: 2 },
    { label: 'APP', code: 3 },
  ])
  // 充值方式
  const channelGetwayList = ref([
    { value: 0, label: i18n.t('lib.Three_party_recharge') },
    { value: 1, label: i18n.t('lib.three_way_jump') },
    { value: 2, label: i18n.t('lib.Internal_account_recharge') },
  ])

  // 账号类型
  const accountTypeList = ref([
    { value: 0, label: i18n.t('lib.member') },
    { value: 2, label: i18n.t('lib.rootProxy') },
  ])

  // 联系方式
  const loginTypeList = ref([
    { value: 1, label: i18n.t('lib.phone') },
    { value: 2, label: i18n.t('lib.email') },
  ])

  // 币种
  const currencyOptions = [
    { value: 1, label: 'CNY' },
    { value: 2, label: 'USDT' },
  ]

  // 状态
  const statusOptions = ref([
    { value: 0, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('lib.on') },
    { value: 2, label: i18n.t('lib.off') },
  ])

  // 根据状态值获取状态名
  function getStatusLabel(status: number | string) {
    const idx = Number(status)
    if (idx && idx < 3 && idx > 0) {
      return statusOptions.value[idx].label
    }
    else {
      return '--'
    }
  }

  // 是否禁用
  const isDisableOptions = ref([
    { value: -1, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('lib.off') },
    { value: 0, label: i18n.t('lib.on') },
  ])

  // 是否禁用
  const isDisableReseverOptions = ref([
    { value: 1, label: i18n.t('lib.on') },
    { value: 0, label: i18n.t('lib.off') },
  ])

  // 是否使用
  const isUseOptions = ref([
    { value: 0, label: i18n.t('lib.not_used') },
    { value: 1, label: i18n.t('lib.used') },
  ])

  // 审核状态
  const auditStatusOptions = ref([
    { value: 0, label: i18n.t('lib.awaiting_audit') },
    { value: 1, label: i18n.t('lib.audit_passed') },
    { value: 2, label: i18n.t('lib.audit_reject') },
  ])

  // 是否鎖定
  const isLockOptions = ref([
    { value: 1, label: i18n.t('lib.not_lock') },
    { value: 2, label: i18n.t('lib.is_lock') },
  ])

  // 订单后台状态
  const orderStatusSystemOptions = ref([
    { value: 0, label: i18n.t('lib.awaiting_handle') },
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.fail') },
    { value: 3, label: i18n.t('lib.expired') },
  ])

  // 订单后台状态
  const orderStatusClientOptions = ref([
    { value: 0, label: i18n.t('lib.awaiting_handle') },
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.expired') },
  ])

  // 出款审核未完成状态
  const pendingUndoneOptions = ref([
    { value: 1, label: i18n.t('lib.audit_1') },
    { value: 2, label: i18n.t('lib.audit_2') },
    { value: 3, label: i18n.t('lib.audit_3') },
  ])

  // 出款审核未完成状态
  const pendingDoneOptions = ref([
    { value: 4, label: i18n.t('lib.audit_4') },
    { value: 5, label: i18n.t('lib.audit_5') },
    { value: 6, label: i18n.t('lib.audit_6') },
    { value: 6, label: i18n.t('lib.audit_7') },
  ])

  // 出款第三方状态
  const thirdPartyStatusOptions = ref([
    { value: 1, label: i18n.t('lib.success') },
    { value: 2, label: i18n.t('lib.fail') },
    { value: 3, label: i18n.t('lib.time_out') },
    { value: 4, label: i18n.t('lib.getting') },
  ])

  // 风控类型
  const riskTypeOptions = ref([
    { value: 1, label: i18n.t('lib.risky_user') },
    { value: 2, label: i18n.t('lib.risky_bank') },
    { value: 3, label: i18n.t('lib.risky_usdt') },
    { value: 4, label: i18n.t('lib.risky_ip') },
    { value: 5, label: i18n.t('lib.risky_device_code') },
  ])

  // 是否需要
  const isNeedOptions = ref([
    { value: -1, label: i18n.t('lib.all') },
    { value: 0, label: i18n.t('lib.is_no') },
    { value: 1, label: i18n.t('lib.is_yes') },
  ])

  // 日志类型
  const logTypeOptions = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') },
    { value: 3, label: i18n.t('lib.exit') },
  ])

  // 验证码类型
  const captchaTypeOptions = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') },
  ])

  // 公告类型
  const announcementType = ref([
    { value: 1, label: i18n.t('lib.login') },
    { value: 2, label: i18n.t('lib.operate') },
  ])

  // 存储方式
  const storageTypeOptions = ref([
    { value: 'local', label: i18n.t('lib.local') },
    { value: 'qiniu', label: i18n.t('lib.qiniu') },
    { value: 'aliyun', label: i18n.t('lib.aliyun') },
    { value: 'tencent', label: i18n.t('lib.tencent') },
  ])

  // app类型
  const appTypeOptions = ref([
    { value: 1, label: i18n.t('lib.android') },
    { value: 2, label: i18n.t('lib.ios') },
  ])

  // app更新方式
  const appUpdateTypeOptions = ref([
    { value: 1, label: i18n.t('lib.not_upgrade') },
    { value: 2, label: i18n.t('lib.recommend_upgrade') },
    { value: 3, label: i18n.t('lib.forcibly_upgrade') },
  ])

  // 结算状态
  const settleTypeOptions = ref([
    { value: 0, label: i18n.t('lib.finish_status_0') },
    { value: 1, label: i18n.t('lib.finish_status_1') },
    { value: 2, label: i18n.t('lib.finish_status_2') },
    { value: 3, label: i18n.t('lib.finish_status_3') },
    { value: 4, label: i18n.t('lib.finish_status_4') },
    { value: 5, label: i18n.t('lib.finish_status_5') },
  ])

  // 是否结算
  const finishTypeOptions = ref([
    { value: 0, label: i18n.t('lib.no_finish') },
    { value: 1, label: i18n.t('lib.has_finish') },
  ])

  // 作废原因
  const invalidReasonOptions = ref([
    { value: 1, label: i18n.t('lib.invalid_reason_1') },
    { value: 2, label: i18n.t('lib.invalid_reason_2') },
    { value: 3, label: i18n.t('lib.invalid_reason_3') },
    { value: 4, label: i18n.t('lib.invalid_reason_4') },
    { value: 5, label: i18n.t('lib.invalid_reason_5') },
    { value: 6, label: i18n.t('lib.invalid_reason_6') },
    { value: 7, label: i18n.t('lib.invalid_reason_7') },
    { value: 8, label: i18n.t('lib.invalid_reason_8') },
    { value: 0, label: i18n.t('lib.invalid_reason_9') },
  ])

  const setWinnerOptions = ref([
    { value: 2, label: i18n.t('lib.win_lose_2') },
    { value: 1, label: i18n.t('lib.win_lose_1') },
  ])

  const setConfirmOptions = ref([
    { value: 1, label: i18n.t('lib.is_confirm_1') },
    { value: 0, label: i18n.t('lib.is_confirm_0') },
  ])

  const userLimitTypeOptions = ref([
    { value: 0, label: i18n.t('lib.user_limit_type_0') },
    { value: 1, label: i18n.t('lib.user_limit_type_1') },
  ])

  /** 是OR否 */
  const opiton1 = ref([
    { value: 1, label: i18n.t('lib.yes') },
    { value: 0, label: i18n.t('lib.no') },
  ])

  const abortTypeOptions = ref([
    { value: 1, label: i18n.t('lib.bet_info') },
    { value: 2, label: i18n.t('lib.play_info') },
  ])
  // 输赢
  const winLossOption = ref([
    { value: 1, label: i18n.t('lib.win') },
    { value: 2, label: i18n.t('lib.loss') },
  ])
  const acceptStatusOption = ref([
    { value: 0, label: i18n.t('lib.confirm0') },
    { value: 1, label: i18n.t('lib.confirm1') },
    { value: 2, label: i18n.t('lib.rejected') },
  ])
  const handicapType = ref([
    { value: 2, label: i18n.t('lib.handicap1') },
    // { value: 2, label: i18n.t('lib.handicap2') },
    { value: 3, label: i18n.t('lib.handicap3') },
    // { value: 4, label: i18n.t('lib.handicap4') },
    // { value: 5, label: i18n.t('lib.handicap5') },
  ])
  const bettingOddsOption = ref([
    { value: 0, label: i18n.t('lib.bet_odds') },
    { value: 1, label: i18n.t('lib.settled_odds') },
  ])
  const equalOption = ref([
    { value: 1, label: i18n.t('lib.great') },
    { value: 2, label: i18n.t('lib.less') },
    { value: 3, label: i18n.t('lib.equals') },
  ])

  const categoryOption = ref([
    { value: 2, label: i18n.t('lib.handicap2') },
    { value: 3, label: i18n.t('table.live') },
  ])

  const proxyOrComOption = ref([
    { value: 0, label: i18n.t('table.comp_name') },
    { value: 1, label: i18n.t('table.agent_name') },
  ])

  const sendStatusOption = ref([
    { value: -1, label: i18n.t('lib.all') },
    { value: 0, label: i18n.t('table.send_no') },
    { value: 1, label: i18n.t('table.send_yes') },
  ])

  const announcementStatusOption = ref([
    { value: 1, label: i18n.t('table.announce_yes') },
    { value: 0, label: i18n.t('table.announce_no') },
  ])

  const announcementTypeOption = ref([
    // { value: -1, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('table.announce_normal') },
    { value: 0, label: i18n.t('table.announce_special') },
  ])

  const announcementDisplayOption = ref([
    // { value: -1, label: i18n.t('lib.all') },
    { value: 1, label: i18n.t('table.announce_display_front') },
    { value: 2, label: i18n.t('table.announce_display_backstage') },
  ])

  const announcementTargetOption = ref([
    { value: 1, label: i18n.t('lib.announce_target_1') },
    { value: 2, label: i18n.t('lib.announce_target_2') },
  ])

  const announcementPurposeOption = ref([
    { value: 1, label: i18n.t('lib.announce_purpose_1') },
    { value: 2, label: i18n.t('lib.announce_purpose_2') },
    { value: 3, label: i18n.t('lib.announce_purpose_3') },
    { value: 4, label: i18n.t('lib.announce_purpose_4') },
    { value: 5, label: i18n.t('lib.announce_purpose_5') },
    { value: 6, label: i18n.t('lib.announce_purpose_6') },
    { value: 7, label: i18n.t('lib.announce_purpose_7') },
    { value: 8, label: i18n.t('lib.announce_purpose_8') },
    { value: 9, label: i18n.t('lib.announce_purpose_9') },
  ])

  const bindStatusOptions = ref([
    { value: 0, label: i18n.t('lib.no_bind') },
    { value: 1, label: i18n.t('lib.has_bind') },
  ])

  const companyTypeOptions = ref([
    { value: 0, label: i18n.t('lib.undefind_type') },
    { value: 1, label: i18n.t('lib.type_cn') },
    { value: 2, label: i18n.t('lib.type_east') },
  ])

  const limitMoneyTypeOptions = ref([
    { value: 0, label: i18n.t('other.amount') },
    { value: 1, label: i18n.t('other.percent') },
  ])

  const receiptConfigOptions = ref([
    { value: 0, label: i18n.t('table.proxy_receipt') },
    { value: 1, label: i18n.t('table.system_receipt') },
  ])

  const langOptions = ref([
    { value: 1, label: i18n.t('table.lang_1') },
    { value: 2, label: i18n.t('table.lang_2') },
    { value: 3, label: i18n.t('table.lang_3') },
    { value: 4, label: i18n.t('table.lang_4') },
    { value: 5, label: i18n.t('table.lang_5') },
    { value: 6, label: i18n.t('table.lang_6') },
    { value: 7, label: i18n.t('table.lang_7') },
    { value: 8, label: i18n.t('table.lang_8') },
  ])

  // 订单状态
  const orderStatusOptions = ref([
    { value: 0, label: i18n.t('lib.fail') },
    { value: 1, label: i18n.t('lib.success') },
  ])

  // 订单类型
  const orderTypeOptions = ref([
    { value: 0, label: i18n.t('table.deduction') },
    { value: 1, label: i18n.t('table.recharge') },
  ])

  // 添加类型
  const addTypeOptions = ref([
    { value: 1, label: i18n.t('table.add_manully') },
    { value: 2, label: i18n.t('table.automatically_added') },
  ])

  // 钱包类型
  const walletTypeOptions = ref([
    { value: 0, label: i18n.t('table.company') },
    { value: 1, label: i18n.t('table.proxy') },
  ])

  return {
    walletTypeOptions,
    addTypeOptions,
    orderTypeOptions,
    orderStatusOptions,
    langOptions,
    receiptConfigOptions,
    limitMoneyTypeOptions,
    companyTypeOptions,
    bindStatusOptions,
    categoryOption,
    orderSource,
    channelGetwayList,
    accountTypeList,
    loginTypeList,
    isNot,
    statusOptions,
    getStatusLabel,
    currencyOptions,
    isUseOptions,
    getLabel,
    auditStatusOptions,
    isLockOptions,
    orderStatusSystemOptions,
    orderStatusClientOptions,
    pendingUndoneOptions,
    pendingDoneOptions,
    thirdPartyStatusOptions,
    riskTypeOptions,
    isNeedOptions,
    isDisableOptions,
    getAvatarImg,
    avatarList,
    logTypeOptions,
    captchaTypeOptions,
    announcementType,
    storageTypeOptions,
    appTypeOptions,
    appUpdateTypeOptions,
    settleTypeOptions,
    finishTypeOptions,
    invalidReasonOptions,
    setWinnerOptions,
    setConfirmOptions,
    enableOption,
    opiton1,
    userLimitTypeOptions,
    abortTypeOptions,
    winLossOption,
    acceptStatusOption,
    bettingOddsOption,
    handicapType,
    equalOption,
    isDisableReseverOptions,
    proxyOrComOption,
    sendStatusOption,
    announcementStatusOption,
    announcementTypeOption,
    announcementDisplayOption,
    announcementPurposeOption,
    announcementTargetOption,
  }
}
