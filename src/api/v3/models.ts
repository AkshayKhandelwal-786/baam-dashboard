export type AuthData = {
  payloads: {
    Login: {
      authorization?: string
      requestBody: {
        phone: string
        password: string
      }

      query?: {}
    }
    Me: {
      authorization?: string

      query?: {}
    }
  }

  responses: {
    Login: {
      status: boolean
      message: string
      data: {
        phone?: string
        password?: string
        token?: string
        super_admin?: boolean
      }
    }
    Me: {
      status: boolean
      message: string
      data: {
        phone?: string
        password?: string
        token?: string
        super_admin?: boolean
      }
    }
  }
}

export type RoleData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      requestBody: {
        name: string
        permissions: unknown
        super_admin: boolean
        order: number
      }

      query?: {}
    }
    Update: {
      authorization?: string
      requestBody: {
        name: string
        permissions: unknown
        super_admin: boolean
      }

      query: {
        id: string
      }
    }
    Delete: {
      authorization?: string

      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        name: string
        permissions: Record<string, unknown>
        order: number
        super_admin: boolean
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: Record<string, unknown>
        order: number
        super_admin: boolean
      }
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: Record<string, unknown>
        order: number
        super_admin: boolean
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: Record<string, unknown>
        order: number
        super_admin: boolean
      }
    }
  }
}

export type ModuleData = {
  payloads: {
    ModuleList: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
  }

  responses: {
    ModuleList: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        name: string
      }>
    }
  }
}

export type AdminData = {
  payloads: {
    AdminList: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
    AdminCreate: {
      authorization?: string
      requestBody: {
        name: string
        phone: string
        password: string
        role: string
      }

      query?: {}
    }
    AdminUpdate: {
      authorization?: string
      requestBody: {
        name: string
        permissions: unknown
        super_admin: boolean
      }

      query: {
        id: string
      }
    }
    AdminDelete: {
      authorization?: string

      query: {
        id: string
      }
    }
  }

  responses: {
    AdminList: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        name: string
        permissions: unknown
        super_admin: boolean
        phone?: string
        password?: string
        token?: string
        createdAt: string
        updatedAt: string
        role: {
          _id: string
          name: string
          permissions: Record<string, unknown>
          order: number
          super_admin: boolean
        }
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    AdminCreate: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: unknown
        super_admin: boolean
        phone?: string
        password?: string
        token?: string
        createdAt: string
        updatedAt: string
        role: {
          _id: string
          name: string
          permissions: Record<string, unknown>
          order: number
          super_admin: boolean
        }
      }
    }
    AdminUpdate: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: unknown
        super_admin: boolean
        phone?: string
        password?: string
        token?: string
        createdAt: string
        updatedAt: string
        role: {
          _id: string
          name: string
          permissions: Record<string, unknown>
          order: number
          super_admin: boolean
        }
      }
    }
    AdminDelete: {
      status: boolean
      message: string
      data: {
        _id: string
        name: string
        permissions: unknown
        super_admin: boolean
        phone?: string
        password?: string
        token?: string
        createdAt: string
        updatedAt: string
        role: {
          _id: string
          name: string
          permissions: Record<string, unknown>
          order: number
          super_admin: boolean
        }
      }
    }
  }
}

export type QrData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      requestBody: {
        points: string | number
        user_types: Array<string>
      }

      query?: {}
    }
    Update: {
      authorization?: string
      requestBody: {
        points: string | number
        user_types: Array<string>
      }

      query: {
        id: string
      }
    }
    Delete: {
      authorization?: string

      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        points: number
        url: string
        code: string
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id: string
        points: number
        url: string
        code: string
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id: string
        points: number
        url: string
        code: string
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id: string
        points: number
        url: string
        code: string
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
  }
}

export type QrHistoryData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
        user?: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        qr: {
          _id: string
          points: number
          url: string
          code: string
          user_types: Array<string>
          createdAt: string
          updatedAt: string
        }
        status: string
        user: string
      }>
      meta: {
        pages: string
        total: string
        page: string
        size: string
      }
    }
  }
}

export type RewardData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      formData: {
        title: string
        label: string
        benefits: string
        details: string
        tnc: string
        discount: string | number
        image: Blob | File
        expire_at: string
        qr: Blob | File
        points: string | number
        user_types: string
      }

      query?: {}
    }
    Update: {
      authorization?: string
      formData: {
        title: string
        label: string
        benefits: string
        details: string
        tnc: string
        discount: number
        image: Blob | File
        expire_at: string
        qr: Blob | File
        points: number
        user_types: string
      }

      query: {
        id: string
      }
    }
    Delete: {
      authorization?: string

      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        title: string
        label: string
        benefits: Array<string>
        details: string
        tnc: string
        discount: number
        image: string
        expire_at: string
        qr: string
        points: number
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id: string
        title: string
        label: string
        benefits: Array<string>
        details: string
        tnc: string
        discount: number
        image: string
        expire_at: string
        qr: string
        points: number
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id: string
        title: string
        label: string
        benefits: Array<string>
        details: string
        tnc: string
        discount: number
        image: string
        expire_at: string
        qr: string
        points: number
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id: string
        title: string
        label: string
        benefits: Array<string>
        details: string
        tnc: string
        discount: number
        image: string
        expire_at: string
        qr: string
        points: number
        user_types: Array<string>
        createdAt: string
        updatedAt: string
      }
    }
  }
}

export type UserData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      requestBody: {
        name: string
        permissions: unknown
        super_admin: boolean
        order: number
      }

      query?: {}
    }
    Update: {
      authorization?: string
      requestBody: {
        name: string
        permissions: unknown
        super_admin: boolean
      }

      query: {
        id: string
      }
    }
    Delete: {
      authorization?: string

      query: {
        id: string
      }
    }
    Detail: {
      authorization?: string

      query: {
        id: string
      }
    }
    UpdateDistributor: {
      authorization?: string

      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }
    }
    Detail: {
      status: boolean
      message: string
      data: {
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }
    }
    UpdateDistributor: {
      status: boolean
      message: string
      data: {
        _id?: string
        name?: string
        email?: string
        phone?: string
        gender?: string
        type?: string
        dob?: string
        photo?: string
        points?: number
        total_points_earned?: number
        token?: string
      }
    }
  }
}



export type SliderData = {
  payloads: {
    List: {
      authorization?: string
      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      requestBody: {
        file: string
      }
      query?: {}
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id: string
        file: string
      }
    }
    Delete: {
      authorization?: string
      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id?: string
        file?: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
    Detail: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
  }
}
export type CatalogueData = {
  payloads: {
    List: {
      authorization?: string
      query: {
        page: string
        size: string
      }
    }
    Create: {
      authorization?: string
      requestBody: {
        file: string
      }
      query?: {}
    }
    Update: {
      status: boolean
      message: string
      data: {
        _id: string
        file: string
      }
    }
    Delete: {
      authorization?: string
      query: {
        id: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id?: string
        file?: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
    Create: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
    Delete: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
    Detail: {
      status: boolean
      message: string
      data: {
        _id?: string
        file?: string
      }
    }
  }
}


export type RewardHistoryData = {
  payloads: {
    List: {
      authorization?: string

      query: {
        page: string
        size: string
        user?: string
      }
    }
  }

  responses: {
    List: {
      status: boolean
      message: string
      data: Array<{
        _id: string
        reward: {
          _id: string
          title: string
          label: string
          benefits: Array<string>
          details: string
          tnc: string
          discount: number
          image: string
          expire_at: string
          qr: string
          points: number
          user_types: Array<string>
          createdAt: string
          updatedAt: string
        }
        user: string
        status: string
        createdAt: string
        updatedAt: string
      }>
      meta: {
        pages: number
        total: number
        page: number
        size: number
      }
    }
  }
}

export type DefaultData = {
  responses: {
    GetAdminDoc: unknown
  }
}
