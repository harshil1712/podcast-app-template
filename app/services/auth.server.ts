import {
  createCookieSessionStorage,
  redirect,
  AppLoadContext,
  type SessionStorage,
} from "@remix-run/cloudflare";

interface AdminSession {
  isAdmin: boolean;
  email: string;
}

export class AdminAuth {
  protected sessionStorage: SessionStorage;
  private context: AppLoadContext;

  constructor(context: AppLoadContext) {
    this.context = context;
    this.sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "__admin_session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secrets: [this.context.cloudflare.env.COOKIE_SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
      },
    });
  }

  async isInitialized(): Promise<boolean> {
    const passwordHash = await this.context.cloudflare.env.admin.get(
      "admin_password_hash"
    );
    return passwordHash !== null;
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const hash = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    const hashArray = new Uint8Array(hash);
    const saltString = btoa(String.fromCharCode(...salt));
    const hashString = btoa(String.fromCharCode(...hashArray));

    return `${saltString}:${hashString}`;
  }

  async getSession(request: Request): Promise<AdminSession | null> {
    const session = await this.sessionStorage.getSession(
      request.headers.get("cookie")
    );
    const isAdmin = session.get("isAdmin");
    const email = session.get("email");
    if (!isAdmin) return null;
    return {
      isAdmin: true,
      email: session.get("email"),
    };
  }

  async destroySession(request: Request): Promise<string> {
    const session = await this.sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    return this.sessionStorage.destroySession(session);
  }

  async login(email: string, password: string, redirectTo: string) {
    if (email !== this.context.cloudflare.env.ADMIN_EMAIL) return null;

    const storedHash = await this.context.cloudflare.env.admin.get(
      "admin_password_hash"
    );
    if (!storedHash) return null;

    const isValid = await this.verifyPassword(password, storedHash);
    if (!isValid) return null;

    const session = await this.sessionStorage.getSession();
    session.set("isAdmin", true);
    session.set("email", email);

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.sessionStorage.commitSession(session),
      },
    });
  }

  async logout(request: Request) {
    const session = await this.sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.sessionStorage.destroySession(session),
      },
    });
  }

  private async verifyPassword(
    password: string,
    storedHash: string
  ): Promise<boolean> {
    const [saltString, hashString] = storedHash.split(":");
    const salt = Uint8Array.from(atob(saltString), (c) => c.charCodeAt(0));

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const hash = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(hash))) === hashString;
  }

  async setInitialPassword(password: string): Promise<void> {
    if (await this.isInitialized()) {
      throw new Error("Admin password already initialized");
    }

    const hashedPassword = await this.hashPassword(password);
    await this.context.cloudflare.env.admin.put(
      "admin_password_hash",
      hashedPassword
    );
  }

  async requireAdmin(request: Request) {
    const session = await this.getSession(request);
    if (!session?.isAdmin) {
      throw redirect("/login", {
        headers: {
          "Set-Cookie": await this.destroySession(request),
        },
      });
    }
    return session;
  }
}
