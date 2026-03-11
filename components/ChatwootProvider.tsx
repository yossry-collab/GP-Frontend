"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
    chatwootSettings?: Record<string, unknown>;
    $chatwoot?: {
      setUser?: (
        identifier: string,
        attributes: Record<string, unknown>,
      ) => void;
      setCustomAttributes?: (attributes: Record<string, unknown>) => void;
      setLocale?: (locale: string) => void;
      reset?: () => void;
      toggle?: (state?: string) => void;
    };
    __chatwootBooted?: boolean;
  }
}

const SCRIPT_ID = "chatwoot-sdk";
const WIDGET_BASE_URL = process.env.NEXT_PUBLIC_CHATWOOT_BASE_URL;
const WEBSITE_TOKEN = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

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

const waitForChatwoot = async () => {
  if (typeof window === "undefined") return null;
  if (window.$chatwoot) return window.$chatwoot;

  return new Promise<typeof window.$chatwoot>((resolve, reject) => {
    let attempts = 0;
    const intervalId = window.setInterval(() => {
      attempts += 1;
      if (window.$chatwoot) {
        window.clearInterval(intervalId);
        resolve(window.$chatwoot);
        return;
      }

      if (attempts >= 60) {
        window.clearInterval(intervalId);
        reject(new Error("Chatwoot widget failed to initialize."));
      }
    }, 200);
  });
};

const loadChatwoot = async () => {
  if (typeof window === "undefined" || !WIDGET_BASE_URL || !WEBSITE_TOKEN) {
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

      if (!isAuthenticated || !user || !WIDGET_BASE_URL || !WEBSITE_TOKEN) {
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

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, user]);

  return null;
}
