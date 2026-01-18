"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const isProduction = process.env.NODE_ENV === 'production';
    console.log(`Seeding ${isProduction ? 'production' : 'staging'} database...`);
    if (!isProduction) {
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);
        const admin = await prisma.user.create({
            data: {
                email: 'admin@staging.com',
                password: adminPassword,
                role: client_1.Role.ADMIN,
            },
        });
        const user = await prisma.user.create({
            data: {
                email: 'user@staging.com',
                password: userPassword,
                role: client_1.Role.USER,
            },
        });
        await prisma.order.createMany({
            data: [
                {
                    title: 'Commande validée',
                    amount: 50,
                    status: client_1.OrderStatus.VALIDATED,
                    userId: admin.id,
                },
                {
                    title: 'Commande en échec',
                    amount: 20,
                    status: client_1.OrderStatus.FAILED,
                    userId: admin.id,
                },
                {
                    title: 'Commande en cours',
                    amount: 10,
                    status: client_1.OrderStatus.PENDING,
                    userId: user.id,
                },
            ],
        });
    }
    else {
        const prodPassword = await bcrypt.hash('prod123', 10);
        await prisma.user.create({
            data: {
                email: 'user@prod.com',
                password: prodPassword,
                role: client_1.Role.USER,
            },
        });
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map