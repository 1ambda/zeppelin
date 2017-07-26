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

export class InterpreterService {
  constructor($http, $rootScope, baseUrlSrv, websocketMsgSrv) {
    'ngInject'

    this.$http = $http
    this.$rootScope = $rootScope
    this.BaseUrlService = baseUrlSrv
    this.WebsocketMessageService = websocketMsgSrv
  }

  getAvailableInterpreters() {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter'
    return this.$http.get(url)
      .then(response => {
        const availableInterpreters = response.data.body
        return availableInterpreters
      })
  }

  getRepositories() {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/repository'
    return this.$http.get(url)
      .then(response => {
        const repositories = response.data.body
        return repositories
      })
  }

  addRepository(requestBody) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/repository'
    return this.$http.post(url, requestBody)
  }

  removeRepository(repositoryId) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/repository/' + repositoryId
    return this.$http.delete(url)
  }

  getInterpreterSettings() {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/setting'
    return this.$http.get(url)
      .then(response => {
        const interpreterSettings = response.data.body
        return interpreterSettings
      })
  }

  addInterpreterSetting(requestBody) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/setting'
    return this.$http.post(url, requestBody)
  }

  removeInterpreterSetting(settingId) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/setting/' + settingId
    return this.$http.delete(url)
  }

  updateInterpreterSetting(settingId, requestBody) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/setting/' + settingId
    return this.$http.put(url, requestBody)
      .then(response => {
        const updatedSetting = response.data.body
        return updatedSetting
      })
  }

  restartInterpreter(settingId) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/setting/restart/' + settingId
    return this.$http.put(url)
      .then(response => {
        const updatedInterpreterSetting = response.data.body
        return updatedInterpreterSetting
      })
  }

  getSparkUIInfo(settingId) {
    const url = this.BaseUrlService.getRestApiBase() + '/interpreter/metadata/' + settingId
    return this.$http.get(url)
      .then(response => {
        const isSparkAppRunning = typeof response.data.body !== 'undefined'
        let sparkAppUrl
        let message

        if (isSparkAppRunning) {
          sparkAppUrl = response.data.body.url

          if (!sparkAppUrl) { message = response.data.body.message }
        }

        return {
          isSparkAppRunning: isSparkAppRunning,
          sparkAppUrl: sparkAppUrl,
          message: message,
        }
      })
  }
}
