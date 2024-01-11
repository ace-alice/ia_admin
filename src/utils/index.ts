import path from 'path-browserify'
import { i18n } from '@/i18n'

export function resolveRoutePath(basePath: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}

// 根据是否使用值获取label
export function getLabel(
  val: number | string,
  options: Array<any>,
  keyL = 'value',
  nKey = 'label',
) {
  const resultArr = options.filter((status: any) => {
    const value = status[keyL] || status.value || status.code || status.id || 0
    return String(value) === String(val)
  })
  if (resultArr.length > 0) {
    return resultArr[0][nKey]
      || resultArr[0].code
      || resultArr[0].value
      || resultArr[0].id
  }
  else {
    return null
  }
}

export function getDomain(url: string) {
  const str = url.match(/[(?<=http://)|(?<=https://)]+[\w\.]+[^/?#]/)
  if (str && str.length > 0) {
    return str[0]
  }
  else {
    return ''
  }
}

/**
 *
 * @param num 需要处理的数字
 * @param keep 需要保留的位数
 * @returns
 */
export function toFixedNumber(num: any, keep = 3) {
  const tempValue = Number(num)
  if (!Number.isNaN(tempValue)) {
    // const result = tempValue.toFixed(keep);
    // return Number(result);
    let result = tempValue.toFixed(keep)
    if (!keep) {
      return result
    }
    if (!result.includes('.')) {
      result += '.00'
    }
    else if (result.split('.')[1].length === 1) {
      result += '0'
    }

    return result
  }
  else {
    return 0
  }
}

// 获取注单状态
export function getBetListStatus(v: any) {
  if (+v.is_cancel === 1) {
    return i18n.global.t('other.invalided')
  }
  else if (+v.receive_status === 2) {
    return i18n.global.t('other.rejected')
  }
  else if (+v.receive_status === 1) {
    return i18n.global.t('other.tobeconfirmed')
  }
  else if (+v.is_getprize === 0) {
    return i18n.global.t('other.settlement')
  }
  else if (+v.prize_status === 1) {
    return i18n.global.t('lib.win')
  }
  else if (+v.prize_status === 2) {
    return i18n.global.t('lib.loss')
  }
  else {
    return ''
  }
}
