import React from "react";
import NotificationsSystem, { atalhoTheme, useNotifications } from "reapop";

export const NotificationsSystemComponent = () => {
  // 1. Retrieve the notifications to display, and the function used to dismiss a notification.
  const { notifications, dismissNotification } = useNotifications();
  return (
    <div>
      <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
        notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
        dismissNotification={(id) => dismissNotification(id)}
        // 4. Pass a builtIn theme or a custom theme.
        theme={atalhoTheme}
      />
    </div>
  );
};
