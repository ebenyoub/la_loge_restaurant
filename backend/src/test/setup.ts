import { vi } from "vitest";

// Set default test environment variables before anything else loads
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "supersecretfortestingmustbeatleast32chars";
process.env.DATABASE_URL = "mysql://root@localhost:3306/la_loge_test_db";

// Mock the entire prisma module to avoid accessing the real database
vi.mock("../lib/prisma.js", () => {
  const innerMock = {
    reservation: {
      create: vi.fn(),
    },
    reservationStatusHistory: {
      create: vi.fn(),
    },
  };
  return {
    prisma: {
      reservation: {
        create: vi.fn(),
      },
      contactMessage: {
        create: vi.fn(),
      },
      administrator: {
        findUnique: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(innerMock)),
    },
  };
});

