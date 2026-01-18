import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(email: string, password: string): Promise<{
        access_token: string;
        sub: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
