import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const authorization =
      request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token =
      authorization.replace("Bearer ", "");

    /*
     * First verify the logged-in user
     * using their Supabase access token.
     */
    const authClient = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      console.error(
        "Authentication error:",
        authError
      );

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /*
     * Read push subscription.
     */
    const subscription =
      await request.json();

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid push subscription.",
        },
        { status: 400 }
      );
    }

    /*
     * SERVER ONLY client.
     *
     * This bypasses RLS.
     */
    const adminClient =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const { error } =
      await adminClient
        .from("push_subscriptions")
        .upsert(
          {
            user_id: user.id,

            endpoint:
              subscription.endpoint,

            p256dh:
              subscription.keys.p256dh,

            auth:
              subscription.keys.auth,
          },
          {
            onConflict:
              "user_id,endpoint",
          }
        );

    if (error) {
      console.error(
        "Push subscription database error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Subscribe notification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save notification subscription.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request
) {
  try {
    const authorization =
      request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token =
      authorization.replace("Bearer ", "");

    /*
     * Verify user.
     */
    const authClient = createClient(
      supabaseUrl,
      supabaseAnonKey
    );

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const {
      endpoint,
    } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        {
          error:
            "Endpoint is required.",
        },
        { status: 400 }
      );
    }

    /*
     * Server-side admin client.
     */
    const adminClient =
      createClient(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const { error } =
      await adminClient
        .from("push_subscriptions")
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "endpoint",
          endpoint
        );

    if (error) {
      console.error(
        "Delete subscription error:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Disable notification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to disable notifications.",
      },
      { status: 500 }
    );
  }
}