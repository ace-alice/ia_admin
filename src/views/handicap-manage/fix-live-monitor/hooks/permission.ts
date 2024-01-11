const toolPermission = {
  startRoll: 'fix-live-monitor:startRoll',
  setStartTime: 'fix-live-monitor:setStartTime',
  setScore: 'fix-live-monitor:setScore',
  close: 'fix-live-monitor:close',
  stop: 'fix-live-monitor:stop',
  recover: 'fix-live-monitor:recover',
  turnReject: 'fix-live-monitor:turnReject',

}

const tablePermission = {
  is_exhibition: 'fix-live-monitor:is_exhibition',
  is_stop: 'fix-live-monitor:is_stop',
  is_hiddle: 'fix-live-monitor:is_hiddle',
  is_lock: 'fix-live-monitor:is_lock',
  point: 'fix-live-monitor:point',
  accept: 'fix-live-monitor:accept',
  acceptAll: 'fix-live-monitor:acceptAll',
  reject: 'fix-live-monitor:reject',
  rejectAll: 'fix-live-monitor:rejectAll',
}

const otherPermission = {
  view: 'fix-live-monitor:view',
  modify: 'fix-live-monitor:modify',
  finishSetOne: 'fix-live-monitor:finishSetOne',
}

export { toolPermission, tablePermission, otherPermission }

