import { vi } from "vitest";

// Set default test environment variables before anything else loads
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "supersecretfortestingmustbeatleast32chars";
process.env.DATABASE_URL = "mysql://root@localhost:3306/la_loge_test_db";

// Mock the entire prisma module to avoid accessing the real database
vi.mock("../lib/prisma.js", () => {
  const prismaMock: any = {
    reservation: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    reservationStatusHistory: {
      create: vi.fn(),
    },
    contactMessage: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    administrator: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    reservationNote: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    menuCategory: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    menuItem: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    restaurantSettings: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    openingHour: {
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    socialLink: {
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
    seoMetadata: {
      findMany: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  };
  
  prismaMock.$transaction = vi.fn((cb) => cb(prismaMock));
  
  return {
    prisma: prismaMock,
  };
});


