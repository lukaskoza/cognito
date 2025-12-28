import database from "@/prisma";

export class UserRepository {
    async create(username: string, sub: string) {
        return await database.user.create({
            data: {
                username,
                sub,
            }
        })
    }

    async delete(username: string) {
        return await database.user.delete({
            where: {
                username,
            }
        })
    }
}


export const userRepository = new UserRepository();