import type { CancelablePromise } from './core/CancelablePromise'
import { OpenAPI } from './core/OpenAPI'
import { request as __request } from './core/request'
import type {
  AuthData,
  RoleData,
  ModuleData,
  AdminData,
  QrData,
  QrHistoryData,
  RewardData,
  UserData,
  RewardHistoryData,
  DefaultData,
  SliderData,
  CataloguesData
} from './models'

export class AuthService {
  /**
   * @returns any Login Response
   * @throws ApiError
   */
  public static login(data: AuthData['payloads']['Login']): CancelablePromise<AuthData['responses']['Login']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/auth/login',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any me Response
   * @throws ApiError
   */
  public static me(data: AuthData['payloads']['Me'] = {}): CancelablePromise<AuthData['responses']['Me']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/auth/me',
      headers: {}
    })
  }
}

export class RoleService {
  /**
   * @returns any Roles list response
   * @throws ApiError
   */
  public static list(data: RoleData['payloads']['List']): CancelablePromise<RoleData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/roles/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any Roles create response
   * @throws ApiError
   */
  public static create(data: RoleData['payloads']['Create']): CancelablePromise<RoleData['responses']['Create']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/roles/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Roles update response
   * @throws ApiError
   */
  public static update(data: RoleData['payloads']['Update']): CancelablePromise<RoleData['responses']['Update']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/roles/',
      headers: {},
      query: {
        ...query
      },
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Roles delete response
   * @throws ApiError
   */
  public static delete(data: RoleData['payloads']['Delete']): CancelablePromise<RoleData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/roles/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class ModuleService {
  /**
   * @returns any Module Response
   * @throws ApiError
   */
  public static moduleList(
    data: ModuleData['payloads']['ModuleList']
  ): CancelablePromise<ModuleData['responses']['ModuleList']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/modules/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class AdminService {
  /**
   * @returns any admins Response
   * @throws ApiError
   */
  public static adminList(
    data: AdminData['payloads']['AdminList']
  ): CancelablePromise<AdminData['responses']['AdminList']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/admins/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any admins Response
   * @throws ApiError
   */
  public static adminCreate(
    data: AdminData['payloads']['AdminCreate']
  ): CancelablePromise<AdminData['responses']['AdminCreate']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/admins/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any admins Response
   * @throws ApiError
   */
  public static adminUpdate(
    data: AdminData['payloads']['AdminUpdate']
  ): CancelablePromise<AdminData['responses']['AdminUpdate']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/admins/',
      headers: {},
      query: {
        ...query
      },
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any admins Response
   * @throws ApiError
   */
  public static adminDelete(
    data: AdminData['payloads']['AdminDelete']
  ): CancelablePromise<AdminData['responses']['AdminDelete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/admins/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class QrService {
  /**
   * @returns any Qr Response
   * @throws ApiError
   */
  public static list(data: QrData['payloads']['List']): CancelablePromise<QrData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/qr/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any Qr Response
   * @throws ApiError
   */
  public static create(data: QrData['payloads']['Create']): CancelablePromise<QrData['responses']['Create']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/qr/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Qr Response
   * @throws ApiError
   */
  public static update(data: QrData['payloads']['Update']): CancelablePromise<QrData['responses']['Update']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/qr/',
      headers: {},
      query: {
        ...query
      },
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Qr Response
   * @throws ApiError
   */
  public static delete(data: QrData['payloads']['Delete']): CancelablePromise<QrData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/qr/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class QrHistoryService {
  /**
   * @returns any Qr Scan HistoryResponse
   * @throws ApiError
   */
  public static list(data: QrHistoryData['payloads']['List']): CancelablePromise<QrHistoryData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/qr-history/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class RewardService {
  /**
   * @returns any Reward Response
   * @throws ApiError
   */
  public static list(data: RewardData['payloads']['List']): CancelablePromise<RewardData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/reward/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any Reward Response
   * @throws ApiError
   */
  public static create(data: RewardData['payloads']['Create']): CancelablePromise<RewardData['responses']['Create']> {
    const { query, formData, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/reward/',
      headers: {},
      formData: formData,
      mediaType: 'multipart/form-data'
    })
  }

  /**
   * @returns any Reward Response
   * @throws ApiError
   */
  public static update(data: RewardData['payloads']['Update']): CancelablePromise<RewardData['responses']['Update']> {
    const { query, formData, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/reward/',
      headers: {},
      query: {
        ...query
      },
      formData: formData,
      mediaType: 'multipart/form-data'
    })
  }

  /**
   * @returns any Reward Response
   * @throws ApiError
   */
  public static delete(data: RewardData['payloads']['Delete']): CancelablePromise<RewardData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/reward/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class UserService {
  /**
   * @returns any User list response
   * @throws ApiError
   */
  public static list(data: UserData['payloads']['List']): CancelablePromise<UserData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/users/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any User create response
   * @throws ApiError
   */
  public static create(data: UserData['payloads']['Create']): CancelablePromise<UserData['responses']['Create']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/users/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any User update response
   * @throws ApiError
   */
  public static update(data: UserData['payloads']['Update']): CancelablePromise<UserData['responses']['Update']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/users/',
      headers: {},
      query: {
        ...query
      },
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any User delete response
   * @throws ApiError
   */
  public static delete(data: UserData['payloads']['Delete']): CancelablePromise<UserData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/users/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any User detail response
   * @throws ApiError
   */
  public static detail(data: UserData['payloads']['Detail']): CancelablePromise<UserData['responses']['Detail']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/users/detail',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any User update response
   * @throws ApiError
   */
  public static updateDistributor(
    data: UserData['payloads']['UpdateDistributor']
  ): CancelablePromise<UserData['responses']['UpdateDistributor']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/admin/users/approve-distributor',
      headers: {},
      query: {
        ...query
      }
    })
  }
}






export class SliderService {
  /**
   * @returns any Slider list response
   * @throws ApiError
   */
  public static list(data: SliderData['payloads']['List']): CancelablePromise<SliderData['responses']['List']> {
    const { query, authorization } = data    
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/sliders/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any Slider create response
   * @throws ApiError
   */
  public static create(data: SliderData['payloads']['Create']): CancelablePromise<SliderData['responses']['Create']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/sliders/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Slider delete response
   * @throws ApiError
   */
  public static delete(data: SliderData['payloads']['Delete']): CancelablePromise<SliderData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/sliders/',
      headers: {},
      query: {
        ...query
      }
    })
  }

}

export class CataloguesService {
  /**
   * @returns any Slider list response
   * @throws ApiError
   */
  public static list(data: CataloguesData['payloads']['List']): CancelablePromise<CataloguesData['responses']['List']> {
    const { query, authorization } = data    

    console.log("<<<<ads",data);
    
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/catalogues/',
      headers: {},
      query: {
        ...query
      }
    })
  }

  /**
   * @returns any Slider create response
   * @throws ApiError
   */
  public static create(data: CataloguesData['payloads']['Create']): CancelablePromise<CataloguesData['responses']['Create']> {
    const { query, requestBody, authorization } = data
    return __request(OpenAPI, {
      method: 'POST',
      url: '/admin/catalogues/',
      headers: {},
      body: requestBody,
      mediaType: 'application/json'
    })
  }

  /**
   * @returns any Slider delete response
   * @throws ApiError
   */
  public static delete(data: CataloguesData['payloads']['Delete']): CancelablePromise<CataloguesData['responses']['Delete']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/admin/catalogues/',
      headers: {},
      query: {
        ...query
      }
    })
  }

}





export class RewardHistoryService {
  /**
   * @returns any RewardHistory Response
   * @throws ApiError
   */
  public static list(
    data: RewardHistoryData['payloads']['List']
  ): CancelablePromise<RewardHistoryData['responses']['List']> {
    const { query, authorization } = data
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin/reward-history/',
      headers: {},
      query: {
        ...query
      }
    })
  }
}

export class DefaultService {
  /**
   * @returns unknown something
   * @throws ApiError
   */
  public static getAdminDoc(): CancelablePromise<DefaultData['responses']['GetAdminDoc']> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/admin-doc'
    })
  }
}
