import { useEffect, useMemo } from "react";

export function useTelegram() {
  const tg = useMemo(() => window.Telegram?.WebApp, []);

  useEffect(() => {
    tg?.ready();
    tg?.expand();
    if (tg?.colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [tg]);

  const user = tg?.initDataUnsafe?.user;

  return {
    tg,
    user: user
      ? {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name ?? "",
          username: user.username ?? "",
          photoUrl: user.photo_url ?? "",
        }
      : {
          id: 1,
          firstName: "Alex",
          lastName: "Chen",
          username: "alexchen",
          photoUrl: "",
        },
  };
}
