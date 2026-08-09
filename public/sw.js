self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data
      ? event.data.json()
      : {};
  } catch {
    data = {
      title: "Life Organizer",
      body: event.data
        ? event.data.text()
        : "You have a reminder.",
    };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Life Organizer",
      {
        body:
          data.body ||
          "You have a reminder.",

        icon: "/icon-192.png",

        badge: "/icon-192.png",

        data: {
          url:
            data.url ||
            "/interviews",
        },
      }
    )
  );
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const url =
      event.notification.data?.url ||
      "/interviews";

    event.waitUntil(
      clients
        .matchAll({
          type: "window",
          includeUncontrolled: true,
        })
        .then((clientList) => {
          for (const client of clientList) {
            if ("focus" in client) {
              client.navigate(url);
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
);