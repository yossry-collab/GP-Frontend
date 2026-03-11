"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

type ChatwootApi = {
  setUser?: (identifier: string, attributes: Record<string, unknown>) => void;
  setCustomAttributes?: (attributes: Record<string, unknown>) => void;
  setLocale?: (locale: string) => void;
  reset?: () => void;
  toggle?: (state?: string) => void;
};

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    chatwootSettings?: Record<string, unknown>;
    $chatwoot?: ChatwootApi;
    __chatwootBooted?: boolean;
  }
}

const SCRIPT_ID = "chatwoot-sdk";
const WIDGET_BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;
const HAS_VALID_CHATWOOT_CONFIG =
  Boolean(WIDGET_BASE_URL) &&
  Boolean(WEBSITE_TOKEN) &&
  WEBSITE_TOKEN !== "your_real_chatwoot_website_token";

const removeChatwootArtifacts = () => {
  if (typeof window === "undefined") return;

  document.getElementById(SCRIPT_ID)?.remove();
  document.getElementById("chatwoot_live_chat_widget")?.remove();
  document.getElementById("cw-bubble-holder")?.remove();

  document
    .querySelectorAll('iframe[src*="chatwoot"], iframe[title*="chatwoot" i]')
    .forEach((node) => node.remove());

  window.__chatwootBooted = false;
  delete window.chatwootSDK;
  delete window.$chatwoot;
  delete window.chatwootSettings;
};

const waitForChatwoot = async (): Promise<ChatwootApi | null> => {
  if (typeof window === "undefined") return null;
  if (window.$chatwoot) return window.$chatwoot;

  return new Promise<ChatwootApi>((resolve, reject) => {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      const currentChatwoot = window.$chatwoot;

      if (currentChatwoot) {
        window.clearInterval(intervalId);
        resolve(currentChatwoot as ChatwootApi);
        return;
      }

      if (attempts >= 60) {
        window.clearInterval(intervalId);
        reject(new Error("Chatwoot widget failed to initialize."));
      }
    }, 200);
  });
};

const loadChatwoot = async (): Promise<ChatwootApi | null> => {
  if (typeof window === "undefined" || !HAS_VALID_CHATWOOT_CONFIG) {
    return null;
  }

  if (window.$chatwoot) {
    return waitForChatwoot();
  }

  if (!window.__chatwootBooted) {
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right",
      type: "standard",
    };
  }

  const existingScript = document.getElementById(SCRIPT_ID);

  if (!existingScript) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = `${WIDGET_BASE_URL}/packs/js/sdk.js`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Chatwoot SDK."));
      document.body.appendChild(script);
    });
  }

  if (window.chatwootSDK && !window.__chatwootBooted) {
    window.chatwootSDK.run({
      websiteToken: WEBSITE_TOKEN,
      baseUrl: WIDGET_BASE_URL,
    });
    window.__chatwootBooted = true;
  }

  return waitForChatwoot();
};

export default function ChatwootProvider() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const initializedUserRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncChatwoot = async () => {
      if (isLoading) return;

      if (!isAuthenticated || !user || !HAS_VALID_CHATWOOT_CONFIG) {
        if (window.$chatwoot) {
          window.$chatwoot.reset?.();
        }
        initializedUserRef.current = null;
        removeChatwootArtifacts();
        return;
      }

      try {
        const chatwoot = await loadChatwoot();
        if (!chatwoot || cancelled) return;

        const locale =
          typeof navigator !== "undefined" &&
          navigator.language.toLowerCase().startsWith("fr")
            ? "fr"
            : "en";

        chatwoot.setLocale?.(locale);

        if (initializedUserRef.current !== user._id) {
          chatwoot.setUser?.(user._id, {
            name: user.username,
            email: user.email,
            phone_number: user.phonenumber || "",
          });
          chatwoot.setCustomAttributes?.({
            role: user.role,
            email: user.email,
            language: locale,
          });
          initializedUserRef.current = user._id;
        }
      } catch (error) {
        console.error("Chatwoot initialization failed:", error);
      }
    };

    syncChatwoot();

    const handleOpenChat = async () => {
      if (!isAuthenticated || !user || !HAS_VALID_CHATWOOT_CONFIG) return;

      try {
        const chatwoot = await loadChatwoot();
        if (!chatwoot || cancelled) return;
        chatwoot.toggle?.("open");
      } catch (error) {
        console.error("Chatwoot open failed:", error);
      }
    };

    window.addEventListener("gameplug:open-chat", handleOpenChat);

    return () => {
      cancelled = true;
      window.removeEventListener("gameplug:open-chat", handleOpenChat);
    };
  }, [isAuthenticated, isLoading, user]);

  return null;
}
