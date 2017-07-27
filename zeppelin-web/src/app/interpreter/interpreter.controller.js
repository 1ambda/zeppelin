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

import { ParagraphStatus, } from '../notebook/paragraph/paragraph.status'

import { InterpreterSessionUnit, InterpreterSessionMode } from './interpreter-session'

export function InterpreterController($rootScope, $scope, ngToast, $timeout, $route,
                               baseUrlSrv, InterpreterService, ErrorHandlerService) {
  'ngInject'

  let ehs = ErrorHandlerService
  let interpreterSettingsTmp = []
  $scope.interpreterSettings = []
  $scope.availableInterpreters = {}
  $scope.showAddNewSetting = false
  $scope.searchInterpreter = ''
  $scope.interpreterPropertyTypes = ['textarea', 'string', 'number', 'url', 'password', 'checkbox']
  ngToast.dismiss()

  $scope.openPermissions = function () {
    $scope.showInterpreterAuth = true
  }

  $scope.closePermissions = function () {
    $scope.showInterpreterAuth = false
  }

  let getSelectJson = function () {
    let selectJson = {
      tags: true,
      minimumInputLength: 3,
      multiple: true,
      tokenSeparators: [',', ' '],
      ajax: {
        url: function (params) {
          if (!params.term) {
            return false
          }
          return baseUrlSrv.getRestApiBase() + '/security/userlist/' + params.term
        },
        delay: 250,
        processResults: function (data, params) {
          let results = []

          if (data.body.users.length !== 0) {
            let users = []
            for (let len = 0; len < data.body.users.length; len++) {
              users.push({
                'id': data.body.users[len],
                'text': data.body.users[len]
              })
            }
            results.push({
              'text': 'Users :',
              'children': users
            })
          }
          if (data.body.roles.length !== 0) {
            let roles = []
            for (let len = 0; len < data.body.roles.length; len++) {
              roles.push({
                'id': data.body.roles[len],
                'text': data.body.roles[len]
              })
            }
            results.push({
              'text': 'Roles :',
              'children': roles
            })
          }
          return {
            results: results,
            pagination: {
              more: false
            }
          }
        },
        cache: false
      }
    }
    return selectJson
  }

  $scope.togglePermissions = function (intpName) {
    angular.element('#' + intpName + 'Owners').select2(getSelectJson())
    if ($scope.showInterpreterAuth) {
      $scope.closePermissions()
    } else {
      $scope.openPermissions()
    }
  }

  $scope.$on('ngRenderFinished', function (event, data) {
    for (let setting = 0; setting < $scope.interpreterSettings.length; setting++) {
      angular.element('#' + $scope.interpreterSettings[setting].name + 'Owners').select2(getSelectJson())
    }
  })

  let getInterpreterSettings = function () {
    return InterpreterService.getInterpreterSettings()
      .then(interpreterSettings => {
        $scope.interpreterSettings = interpreterSettings
        checkDownloadingDependencies()
      })
      .catch(ehs.handleHttpError('Failed to get interpreter settings'))
  }

  const checkDownloadingDependencies = function () {
    let isDownloading = false
    for (let index = 0; index < $scope.interpreterSettings.length; index++) {
      let setting = $scope.interpreterSettings[index]
      if (setting.status === 'DOWNLOADING_DEPENDENCIES') {
        isDownloading = true
      }

      if (setting.status === ParagraphStatus.ERROR || setting.errorReason) {
        ngToast.danger({content: 'Error setting properties for interpreter \'' +
        setting.group + '.' + setting.name + '\': ' + setting.errorReason,
          verticalPosition: 'top',
          dismissOnTimeout: false
        })
      }
    }

    if (isDownloading) {
      $timeout(function () {
        if ($route.current.$$route.originalPath === '/interpreter') {
          getInterpreterSettings()
        }
      }, 2000)
    }
  }

  let getAvailableInterpreters = function () {
    InterpreterService.getAvailableInterpreters()
      .then(availableInterpreters => {
        $scope.availableInterpreters = availableInterpreters
      })
      .catch(ehs.handleHttpError('Failed to get available interpreters'))
  }

  let emptyNewProperty = function(object) {
    angular.extend(object, {propertyValue: '', propertyKey: '', propertyType: $scope.interpreterPropertyTypes[0]})
  }

  let emptyNewDependency = function (object) {
    angular.extend(object, {depArtifact: '', depExclude: ''})
  }

  let removeTMPSettings = function (index) {
    interpreterSettingsTmp.splice(index, 1)
  }

  $scope.copyOriginInterpreterSettingProperties = function (settingId) {
    let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
    interpreterSettingsTmp[index] = angular.copy($scope.interpreterSettings[index])
  }

  $scope.defaultValueByType = function (setting) {
    if (setting.propertyType === 'checkbox') {
      setting.propertyValue = false
      return
    }

    setting.propertyValue = ''
  }

  /**
   * @param setting
   * @param sessionMode `isolated`, `scope` or `shared`
   * @param sessionUnit `perUser` or `perNote`
   */
  $scope.setInterpreterSessionOption = function(setting, sessionMode, sessionUnit) {
    const option = setting.option

    if (sessionMode === InterpreterSessionMode.ISOLATED) {
      option[sessionUnit] = sessionMode
      option.session = false
      option.process = true
    } else if (sessionMode === InterpreterSessionMode.SCOPED) {
      option[sessionUnit] = sessionMode
      option.session = true
      option.process = false
    } else {
      option[sessionUnit] = InterpreterSessionMode.SHARED
      option.session = false
      option.process = false
    }
  }

  $scope.getSettingBySettingId = function(settingId) {
    let setting
    if (typeof settingId === 'undefined') {
      setting = $scope.newInterpreterSetting
    } else {
      let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
      setting = $scope.interpreterSettings[index]
    }

    return setting
  }

  $scope.updateInterpreterSetting = function (form, settingId) {
    const thisConfirm = BootstrapDialog.confirm({
      closable: false,
      closeByBackdrop: false,
      closeByKeyboard: false,
      title: '',
      message: 'Do you want to update this interpreter and restart with new settings?',
      callback: function (result) {
        if (!result) {
          form.$show()
          return
        }

        let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
        let setting = $scope.interpreterSettings[index]
        if (setting.propertyKey !== '' || setting.propertyKey) {
          $scope.addNewInterpreterProperty(settingId)
        }
        if (setting.depArtifact !== '' || setting.depArtifact) {
          $scope.addNewInterpreterDependency(settingId)
        }
        // add missing field of option
        if (!setting.option) {
          setting.option = {}
        }
        if (setting.option.isExistingProcess === undefined) {
          setting.option.isExistingProcess = false
        }
        if (setting.option.setPermission === undefined) {
          setting.option.setPermission = false
        }
        if (setting.option.remote === undefined) {
          // remote always true for now
          setting.option.remote = true
        }
        setting.option.owners = angular.element('#' + setting.name + 'Owners').val()

        let request = {
          option: angular.copy(setting.option),
          properties: angular.copy(setting.properties),
          dependencies: angular.copy(setting.dependencies)
        }

        thisConfirm.$modalFooter.find('button').addClass('disabled')
        thisConfirm.$modalFooter.find('button:contains("OK")')
          .html('<i class="fa fa-circle-o-notch fa-spin"></i> Saving Setting')

        InterpreterService.updateInterpreterSetting(settingId, request)
          .then(updatedSetting => {
            showInfoToast(`Interpreter setting ${settingId} was updated`)
            $scope.interpreterSettings[index] = updatedSetting
            removeTMPSettings(index)
            checkDownloadingDependencies()
          })
          .catch(ehs.handleHttpError('Failed to update interpreter setting'))
          .then(() => {
            thisConfirm.close()
          })
        return false
      }
    })
  }

  $scope.resetInterpreterSetting = function (settingId) {
    let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)

    // Set the old settings back
    $scope.interpreterSettings[index] = angular.copy(interpreterSettingsTmp[index])
    removeTMPSettings(index)
  }

  $scope.removeInterpreterSetting = function (settingId) {
    BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Do you want to delete this interpreter setting?',
      callback: function (result) {
        if (!result) { return }

        InterpreterService.removeInterpreterSetting(settingId)
          .then(() => {
            showInfoToast(`Interpreter setting ${settingId} was removed`)
            let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
            $scope.interpreterSettings.splice(index, 1)
          })
          .catch(ehs.handleHttpError(`Failed to remove interpreter setting: ${settingId}`))
      }
    })
  }

  $scope.newInterpreterGroupChange = function () {
    const availableInterpreters = $scope.availableInterpreters
    const availableInterpreterKeys = Object.keys(availableInterpreters)
    const filtered = []

    for (let key of availableInterpreterKeys) {
      const intp = availableInterpreters[key]
      if (intp.name === $scope.newInterpreterSetting.group) {
        filtered.push(intp)
      }
    }

    let el = filtered.map(is => is.properties)
    let properties = {}
    for (let i = 0; i < el.length; i++) {
      let intpInfo = el[i]
      for (let key in intpInfo) {
        properties[key] = {
          value: intpInfo[key].defaultValue,
          description: intpInfo[key].description,
          type: intpInfo[key].type
        }
      }
    }
    $scope.newInterpreterSetting.properties = properties
  }

  $scope.restartInterpreterSetting = function (settingId) {
    BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Do you want to restart this interpreter?',
      callback: function (result) {
        if (!result) { return }

        InterpreterService.restartInterpreter(settingId)
          .then(updatedInterpreterSetting => {
            showInfoToast('Interpreter stopped. Will be lazily started on next run.')
            let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
            $scope.interpreterSettings[index] = updatedInterpreterSetting
          })
          .catch(ehs.handleHttpError('Failed to restart interpreter'))
      }
    })
  }

  $scope.addNewInterpreterSetting = function () {
    // user input validation on interpreter creation
    if (!$scope.newInterpreterSetting.name ||
      !$scope.newInterpreterSetting.name.trim() || !$scope.newInterpreterSetting.group) {
      BootstrapDialog.alert({
        closable: true,
        title: 'Add interpreter',
        message: 'Please fill in interpreter name and choose a group'
      })
      return
    }

    if ($scope.newInterpreterSetting.name.indexOf('.') >= 0) {
      BootstrapDialog.alert({
        closable: true,
        title: 'Add interpreter',
        message: '\'.\' is invalid for interpreter name'
      })
      return
    }

    let index = $scope.interpreterSettings.findIndex(is => is.name === $scope.newInterpreterSetting.name)
    if (index >= 0) {
      BootstrapDialog.alert({
        closable: true,
        title: 'Add interpreter',
        message: 'Name ' + $scope.newInterpreterSetting.name + ' already exists'
      })
      return
    }

    let newSetting = $scope.newInterpreterSetting
    if (newSetting.propertyKey !== '' || newSetting.propertyKey) {
      $scope.addNewInterpreterProperty()
    }
    if (newSetting.depArtifact !== '' || newSetting.depArtifact) {
      $scope.addNewInterpreterDependency()
    }
    if (newSetting.option.setPermission === undefined) {
      newSetting.option.setPermission = false
    }
    newSetting.option.owners = angular.element('#newInterpreterOwners').val()

    let request = angular.copy($scope.newInterpreterSetting)

    // Change properties to proper request format
    let newProperties = {}

    for (let p in newSetting.properties) {
      newProperties[p] = {
        value: newSetting.properties[p].value,
        type: newSetting.properties[p].type,
        name: p
      }
    }

    request.properties = newProperties
    const interpreterSettingName = $scope.newInterpreterSetting.name

    InterpreterService.addInterpreterSetting(request)
      .then(() => {
        showInfoToast(`Interpreter setting ${interpreterSettingName} is created`)
        $scope.resetNewInterpreterSetting()
        $scope.showAddNewSetting = false
        return getInterpreterSettings()
      })
      .catch(ehs.handleHttpError('Failed to add a new interpreter'))
  }

  $scope.cancelInterpreterSetting = function () {
    $scope.showAddNewSetting = false
    $scope.resetNewInterpreterSetting()
  }

  $scope.resetNewInterpreterSetting = function () {
    $scope.newInterpreterSetting = {
      name: undefined,
      group: undefined,
      properties: {},
      dependencies: [],
      option: {
        remote: true,
        isExistingProcess: false,
        setPermission: false,
        session: false,
        process: false

      }
    }
    emptyNewProperty($scope.newInterpreterSetting)
  }

  $scope.removeInterpreterProperty = function (key, settingId) {
    if (settingId === undefined) {
      delete $scope.newInterpreterSetting.properties[key]
    } else {
      let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
      delete $scope.interpreterSettings[index].properties[key]
    }
  }

  $scope.removeInterpreterDependency = function (artifact, settingId) {
    if (settingId === undefined) {
      $scope.newInterpreterSetting.dependencies = $scope.newInterpreterSetting.dependencies
        .filter(dep => {
          return dep.groupArtifactVersion !== artifact
        })
    } else {
      let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
      $scope.interpreterSettings[index].dependencies = $scope.interpreterSettings[index].dependencies
        .filter(dep => {
          return dep.groupArtifactVersion !== artifact
        })
    }
  }

  $scope.addNewInterpreterProperty = function (settingId) {
    if (settingId === undefined) {
      // Add new property from create form
      if (!$scope.newInterpreterSetting.propertyKey || $scope.newInterpreterSetting.propertyKey === '') {
        return
      }
      $scope.newInterpreterSetting.properties[$scope.newInterpreterSetting.propertyKey] = {
        value: $scope.newInterpreterSetting.propertyValue,
        type: $scope.newInterpreterSetting.propertyType
      }
      emptyNewProperty($scope.newInterpreterSetting)
    } else {
      // Add new property from edit form
      let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
      let setting = $scope.interpreterSettings[index]

      if (!setting.propertyKey || setting.propertyKey === '') {
        return
      }

      setting.properties[setting.propertyKey] =
        {value: setting.propertyValue, type: setting.propertyType}

      emptyNewProperty(setting)
    }
  }

  $scope.addNewInterpreterDependency = function (settingId) {
    if (settingId === undefined) {
      // Add new dependency from create form
      if (!$scope.newInterpreterSetting.depArtifact || $scope.newInterpreterSetting.depArtifact === '') {
        return
      }

      // overwrite if artifact already exists
      let newSetting = $scope.newInterpreterSetting
      for (let d in newSetting.dependencies) {
        if (newSetting.dependencies[d].groupArtifactVersion === newSetting.depArtifact) {
          newSetting.dependencies[d] = {
            'groupArtifactVersion': newSetting.depArtifact,
            'exclusions': newSetting.depExclude
          }
          newSetting.dependencies.splice(d, 1)
        }
      }

      newSetting.dependencies.push({
        'groupArtifactVersion': newSetting.depArtifact,
        'exclusions': (newSetting.depExclude === '') ? [] : newSetting.depExclude
      })
      emptyNewDependency(newSetting)
    } else {
      // Add new dependency from edit form
      let index = $scope.interpreterSettings.findIndex(is => is.id === settingId)
      let setting = $scope.interpreterSettings[index]
      if (!setting.depArtifact || setting.depArtifact === '') {
        return
      }

      // overwrite if artifact already exists
      for (let dep in setting.dependencies) {
        if (setting.dependencies[dep].groupArtifactVersion === setting.depArtifact) {
          setting.dependencies[dep] = {
            'groupArtifactVersion': setting.depArtifact,
            'exclusions': setting.depExclude
          }
          setting.dependencies.splice(dep, 1)
        }
      }

      setting.dependencies.push({
        'groupArtifactVersion': setting.depArtifact,
        'exclusions': (setting.depExclude === '') ? [] : setting.depExclude
      })
      emptyNewDependency(setting)
    }
  }

  $scope.showErrorMessage = function (setting) {
    BootstrapDialog.show({
      title: 'Error downloading dependencies',
      message: setting.errorReason
    })
  }

  let init = function() {
    $scope.resetNewInterpreterSetting()

    getInterpreterSettings()
    getAvailableInterpreters()
  }

  $scope.showSparkUI = function (settingId) {
    InterpreterService.getSparkUIInfo(settingId)
      .then(({ isSparkAppRunning, sparkAppUrl, message }) => {
        if (!isSparkAppRunning) {
          BootstrapDialog.alert({ message: 'No spark application running' })
          return
        }

        if (sparkAppUrl) {
          window.open(sparkAppUrl, '_blank')
        } else {
          BootstrapDialog.alert({ message: message })
        }
      })
      .catch(ehs.handleHttpError('Failed to get information for Spark UI'))
  }

  $scope.isEmptyDependencies = function(dependencies) {
    return dependencies.length === 0
  }

  $scope.isEmptyProperties = function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object
  }

  function showInfoToast(message) {
    ngToast.info({
      content: message,
      timeout: '3000',
      verticalPosition: 'bottom',
    })
  }

  $scope.onSessionUnitChanged = function($event) {
    const { settingId, isPerNote, isPerUser, } = $event
    const setting = this.getSettingBySettingId(settingId)
    const option = setting.option

    option[InterpreterSessionUnit.PER_NOTE] = isPerNote
    option[InterpreterSessionUnit.PER_USER] = isPerUser
  }

  $scope.onPerNoteSessionModeChanged = function($event) {
    const { settingId, sessionMode, } = $event
    const setting = this.getSettingBySettingId(settingId)
    this.setInterpreterSessionOption(setting, sessionMode, InterpreterSessionUnit.PER_NOTE)
  }

  $scope.onPerUserSessionModeChanged = function($event) {
    const { settingId, sessionMode, } = $event
    const setting = this.getSettingBySettingId(settingId)
    this.setInterpreterSessionOption(setting, sessionMode, InterpreterSessionUnit.PER_USER)
  }

  init()
}
