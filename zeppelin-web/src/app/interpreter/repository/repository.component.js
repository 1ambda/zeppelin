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

import RepositoryTemplate from './repository.html'
import './repository.css'

class RepositoryController {
  constructor(RepositoryService, ErrorHandlerService) {
    'ngInject'

    this.repositoryService = RepositoryService
    this.ehs = ErrorHandlerService

    this.repositories = []
    this.newRepoSetting = {}
  }

  $onInit() {
    this.resetNewRepositorySetting()
    this.getRepositories()
  }

  resetNewRepositorySetting() {
    this.newRepoSetting = {
      id: '',
      url: '',
      snapshot: false,
      username: '',
      password: '',
      proxyProtocol: 'HTTP',
      proxyHost: '',
      proxyPort: null,
      proxyLogin: '',
      proxyPassword: ''
    }
  }

  getRepositories() {
    return this.repositoryService.getRepositories()
      .then(repositories => {
        this.repositories = repositories
      })
      .catch(this.ehs.handleHttpError('Failed to get repositories'))
  }

  addNewRepository() {
    let request = angular.copy(this.newRepoSetting)
    this.repositoryService.addRepository(request)
      .then(() => {
        this.resetNewRepositorySetting()
        angular.element('#repoModal').modal('hide')
        return this.getRepositories()
      })
      .catch(this.ehs.handleHttpError('Failed to add a new repository'))
  }

  removeRepository(repoId) {
    BootstrapDialog.confirm({
      closable: true,
      title: '',
      message: 'Do you want to delete this repository?',
      callback: (result) => {
        if (!result) { return }

        this.repositoryService.removeRepository(repoId)
          .then(() => {
            let index = this.repositories.findIndex(r => r.id === repoId)
            this.repositories.splice(index, 1)
          })
          .catch(this.ehs.handleHttpError(`Failed to remove repository: ${repoId}`))
      }
    })
  }

  isDefaultRepository(repoId) {
    return (repoId === 'central' || repoId === 'local')
  }
}

export const RepositoryComponent = {
  bindings: {
    show: '<',
  },
  template: RepositoryTemplate,
  controller: RepositoryController,
}
