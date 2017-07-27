/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import BindingModeTemplate from './binding-mode.html'
import './binding-mode.css'

import {
  InterpreterSessionUnit, InterpreterSessionMode, InterpreterSessionUnitName,
} from '../interpreter-session'

class BindingModeController {
  constructor($rootScope) {
    'ngInject'

    this.rootScope = $rootScope
  }

  isReadonly() {
    return this.isReadonly
  }

  getSetting() {
    return this.setting
  }

  getSettingId() {
    return this.getSetting().id
  }

  getTicket() {
    return this.rootScope.ticket
  }

  isAnonymousPrincipal() {
    return this.getTicket().principal === 'anonymous'
  }

  isAnonymousTicket() {
    return this.getTicket().ticket === 'anonymous'
  }

  isEmptyRoles() {
    return this.getTicket().roles === '[]'
  }

  getInterpreterBindingModeDocsLink() {
    const currentVersion = this.rootScope.zeppelinVersion
    return `https://zeppelin.apache.org/docs/${currentVersion}/usage/interpreter/interpreter_binding_mode.html`
  }

  getPerNoteSessionMode() {
    const setting = this.getSetting()
    const option = setting.option
    return option[InterpreterSessionUnit.PER_NOTE]
  }

  getPerUserSessionMode() {
    const setting = this.getSetting()
    const option = setting.option
    return option[InterpreterSessionUnit.PER_USER]
  }

  getSessionUnitName() {
    const setting = this.getSetting()
    const option = setting.option

    let perNote = option[InterpreterSessionUnit.PER_NOTE]
    let perUser = option[InterpreterSessionUnit.PER_USER]

    if (perNote === InterpreterSessionMode.SHARED && perUser === InterpreterSessionMode.SHARED) {
      return InterpreterSessionUnitName.GLOBAL
    }

    // for anonymous user, use per note session only
    if (this.isAnonymousTicket() && this.isEmptyRoles()) {
      if (typeof perNote !== 'undefined' && perNote !== '') {
        return InterpreterSessionUnitName.PER_NOTE
      }
    } else if (!this.isAnonymousTicket()) {
      // for logged in user, use per note session when per user setting is empty
      if (typeof perNote !== 'undefined' && perNote !== '' &&
        (typeof perUser === 'undefined' || perUser === '')) {
        return InterpreterSessionUnitName.PER_NOTE
      }

      // use per user setting
      if (typeof perUser !== 'undefined' && perUser !== '') {
        return InterpreterSessionUnitName.PER_USER
      }
    }

    // use global in case of invalid conf
    if (this.getSettingId()) {
      console.warn('Found invalid settings, Use globally shared mode ' +
        `(perUser: ${perUser}, perNote: ${perNote})`)
    }

    option.perNote = InterpreterSessionMode.SHARED
    option.perUser = InterpreterSessionMode.SHARED
    return InterpreterSessionUnitName.GLOBAL
  }

  setSessionUnit(isPerNote, isPerUser) {
    const settingId = this.getSettingId()
    this.onSessionUnitChanged({
      $event: { settingId, isPerNote, isPerUser },
    })
  }

  setPerUserSessionMode(sessionMode) {
    const settingId = this.getSettingId()
    this.onPerUserSessionModeChanged({
      $event: { settingId, sessionMode },
    })
  }

  setPerNoteSessionMode(sessionMode) {
    const settingId = this.getSettingId()
    this.onPerNoteSessionModeChanged({
      $event: { settingId, sessionMode },
    })
  }

  usePerNoteWithPerUser() {
    return this.isPerUserSession() &&
      !this.isAnonymousPrincipal() &&
      this.getPerNoteSessionMode() !== InterpreterSessionMode.SHARED
  }

  isPerUserSession() {
    return this.getSessionUnitName() === InterpreterSessionUnitName.PER_USER
  }

  isPerNoteSession() {
    return this.getSessionUnitName() === InterpreterSessionUnitName.PER_NOTE
  }

  isGlobalSession() {
    return this.getSessionUnitName() === InterpreterSessionUnitName.GLOBAL
  }

  isSharedPerNoteSession() {
    return this.getPerNoteSessionMode() === InterpreterSessionMode.SHARED
  }

  getOptionTextForSelectedSessionMode() {
    if (this.isGlobalSession()) {
      return InterpreterSessionMode.SHARED
    } else if (this.isPerNoteSession()) {
      return this.getPerNoteSessionMode()
    } else if (this.isPerUserSession()) {
      return this.getPerUserSessionMode()
    }
  }

  showImpersonationCheckbox() {
    return this.getSessionUnitName() === InterpreterSessionUnitName.PER_USER &&
      this.getPerUserSessionMode() === InterpreterSessionMode.ISOLATED
  }

  validateUserImpersonateValue() {
    const setting = this.getSetting()

    if (!setting.option) { setting.option = {} }

    if (setting.option.isUserImpersonate === undefined) {
      setting.option.isUserImpersonate = false
    }

    // if not per-user unit or not isolated mode, set false
    if (this.getSessionUnitName() !== InterpreterSessionUnitName.PER_USER ||
      this.getPerUserSessionMode() !== InterpreterSessionMode.ISOLATED) {
      setting.option.isUserImpersonate = false
    }
  }
}

export const BindingModeComponent = {
  bindings: {
    setting: '<', // object
    isReadonly: '<',
    onPerUserSessionModeChanged: '&',
    onPerNoteSessionModeChanged: '&',
    onSessionUnitChanged: '&',
  },
  template: BindingModeTemplate,
  controller: BindingModeController,
}
