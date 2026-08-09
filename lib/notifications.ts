function urlBase64ToUint8Array(
  base64String: string
) {
  const padding =
    "=".repeat(
      (4 - (base64String.length % 4)) % 4
    );

  const base64 =
    (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

  const rawData =
    window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) =>
      char.charCodeAt(0)
    )
  );
}

export async function enableNotifications() {
  if (typeof window === "undefined") {
    throw new Error(
      "Notifications are only available in the browser."
    );
  }

  if (!("Notification" in window)) {
    throw new Error(
      "This browser does not support notifications."
    );
  }

  if (!("serviceWorker" in navigator)) {
    throw new Error(
      "This browser does not support service workers."
    );
  }

  if (!("PushManager" in window)) {
    throw new Error(
      "This browser does not support push notifications."
    );
  }

  /*
   * Get the currently logged-in Supabase user.
   */
  const { supabase } =
    await import("@/lib/supabase");

  const {
    data: {
      session,
    },
  } =
    await supabase.auth.getSession();

  if (!session) {
    throw new Error(
      "You must be logged in to enable notifications."
    );
  }

  /*
   * Ask for browser permission.
   */
  const permission =
    await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted."
    );
  }

  /*
   * Register service worker.
   */
  await navigator.serviceWorker.register(
    "/sw.js",
    {
      scope: "/",
    }
  );

  /*
   * Wait until service worker is active.
   */
  const registration =
    await navigator.serviceWorker.ready;

  /*
   * Check existing subscription.
   */
  let subscription =
    await registration.pushManager.getSubscription();

  /*
   * Create subscription.
   */
  if (!subscription) {
    const vapidKey =
      process.env
        .NEXT_PUBLIC_VAPID_PUBLIC_KEY;

    if (!vapidKey) {
      throw new Error(
        "NEXT_PUBLIC_VAPID_PUBLIC_KEY is missing."
      );
    }

    subscription =
      await registration.pushManager.subscribe({
        userVisibleOnly: true,

        applicationServerKey:
          urlBase64ToUint8Array(
            vapidKey
          ),
      });
  }

  /*
   * Send subscription + Supabase token
   * to our API.
   */
  const response =
    await fetch(
      "/api/notifications/subscribe",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${session.access_token}`,
        },

        body: JSON.stringify(
          subscription
        ),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ||
        "Failed to save notification subscription."
    );
  }

  return subscription;
}

export async function disableNotifications() {
  if (
    typeof window === "undefined" ||
    !("serviceWorker" in navigator)
  ) {
    return;
  }

  const { supabase } =
    await import("@/lib/supabase");

  const {
    data: {
      session,
    },
  } =
    await supabase.auth.getSession();

  if (!session) {
    throw new Error(
      "You must be logged in."
    );
  }

  const registration =
    await navigator.serviceWorker.ready;

  const subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    return;
  }

  const endpoint =
    subscription.endpoint;

  /*
   * Remove browser push subscription.
   */
  await subscription.unsubscribe();

  /*
   * Remove subscription from Supabase.
   */
  const response =
    await fetch(
      "/api/notifications/subscribe",
      {
        method: "DELETE",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          endpoint,
        }),
      }
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error ||
        "Failed to disable notifications."
    );
  }
}