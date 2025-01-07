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
  // private context: AppLoadContext;

  constructor(context: AppLoadContext) {
    // this.context = context;
    this.sessionStorage = createCookieSessionStorage({
      cookie: {
        name: "__admin_session",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cRet"], //store the value as a secret [this.context.cloudflare.env.COOKIE_SESSION_SECRET]
        secure: process.env.NODE_ENV === "production",
      },
    });
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
    if (!email) return null;
    if (!password) return null;

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
