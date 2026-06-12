import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryPort } from "../ports/user.repository.port";
import { UpdateUserDto } from "@repo/contract";

@Injectable()
export class UpdateUserUseCase {
    constructor(
        @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort
    ) {}
    async execute (id:string, dto: UpdateUserDto) {
        return this.users.update(id, dto);
    }
}