import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(email: string, password: string): Promise<{
        access_token: string;
        sub: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    }>;
}
