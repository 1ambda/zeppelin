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

export class RepositoryService {
  constructor($http, $rootScope, baseUrlSrv, websocketMsgSrv) {
    'ngInject'

    this.$http = $http
    this.$rootScope = $rootScope
    this.BaseUrlService = baseUrlSrv
    this.WebsocketMessageService = websocketMsgSrv
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
}
