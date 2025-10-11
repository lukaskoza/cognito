import { t } from 'elysia'

export const loginBody = t.Object({
    email: t.String({
        description: 'The email of the user'
    }),
    password: t.String({
        description: 'The password of the user'
    })
})


export const registerBody = t.Object({
    email: t.String({
        description: 'The email of the user'
    }),
    password: t.String({
        description: 'The password of the user'
    })
})


export const refreshBody = t.Object({
    refreshToken: t.String({
        description: 'The refresh token of the user'
    })
})


export type LoginBody = typeof loginBody.static
export type RegisterBody = typeof registerBody.static
export type RefreshBody = typeof refreshBody.static