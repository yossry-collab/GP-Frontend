"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Ticket,
  User,
  X,
} from "lucide-react";
import { supportAPI } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type SupportLocale = "en" | "fr";

type SupportArticle = {
  _id: string;
  slug: string;
  category: string;
  tags: string[];
  title: string;
  question: string;
  summary: string;
  answer: string;
};

type SupportContext = {
  recentOrders: Array<{
    _id: string;
    totalPrice: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
  loyalty: {
    points: number;
    lifetimePoints: number;
    tier: string;
  };
  openTickets: number;
  unreadNotifications: number;
};

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const copy = {
  en: {
    title: "GamePlug AI Support",
    subtitle: "Orders, payments, rewards, refunds, and account help.",
    intro:
      "I can answer store questions, explain order and payment status, help with rewards, and create a support ticket when a human follow-up is needed.",
    inputPlaceholder: "Ask about your order, rewards, payments, or account...",
    send: "Send",
    loading: "Loading support context...",
    createTicket: "Escalate to support",
    creatingTicket: "Creating ticket...",
    ticketDone:
      "Support ticket created. A human agent can follow up from here.",
    signIn: "Sign in to use the support assistant.",
    quickPrompts: [
      "Where is my order?",
      "How does Flouci payment work?",
      "How do loyalty points work?",
      "I need help with a refund",
    ],
    noQuestion: "Tell me what happened first so I can create a useful ticket.",
    fallback:
      "I do not have a confident direct answer for that yet, but I can create a support ticket for a human review.",
  },
  fr: {
    title: "Assistant IA GamePlug",
    subtitle: "Commandes, paiements, fidelite, remboursements et compte.",
    intro:
      "Je peux repondre aux questions sur la boutique, expliquer les statuts de commande et de paiement, aider sur la fidelite et creer un ticket si un suivi humain est necessaire.",
    inputPlaceholder:
      "Posez une question sur votre commande, vos points, le paiement ou votre compte...",
    send: "Envoyer",
    loading: "Chargement du contexte support...",
    createTicket: "Escalader au support",
    creatingTicket: "Creation du ticket...",
    ticketDone:
      "Le ticket support a ete cree. Un agent humain pourra prendre le relais.",
    signIn: "Connectez-vous pour utiliser l'assistant support.",
    quickPrompts: [
      "Ou est ma commande ?",
      "Comment fonctionne le paiement Flouci ?",
      "Comment marchent les points de fidelite ?",
      "J'ai besoin d'un remboursement",
    ],
    noQuestion:
      "Expliquez-moi d'abord le probleme pour que je cree un ticket utile.",
    fallback:
      "Je n'ai pas encore de reponse totalement fiable pour ce cas, mais je peux creer un ticket pour une verification humaine.",
  },
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const dispatchChatStatus = (status: string, message?: string) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent("gameplug:chat-status", {
      detail: { status, message },
    }),
  );
};

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function SupportAssistant() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locale, setLocale] = useState<SupportLocale>("en");
  const [articles, setArticles] = useState<SupportArticle[]>([]);
  const [supportContext, setSupportContext] = useState<SupportContext | null>(
    null,
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [ticketMessage, setTicketMessage] = useState<string | null>(null);

  const text = copy[locale];

  const lastUserMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user"),
    [messages],
  );

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    setLocale(navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en");
  }, []);

  useEffect(() => {
    const openAssistant = () => {
      setIsOpen(true);
    };

    window.addEventListener("gameplug:open-support-assistant", openAssistant);

    return () => {
      window.removeEventListener(
        "gameplug:open-support-assistant",
        openAssistant,
      );
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !user) {
      return;
    }

    let cancelled = false;

    const loadAssistant = async () => {
      try {
        setIsLoading(true);
        setTicketMessage(null);
        dispatchChatStatus("loading");

        const [knowledgeResponse, contextResponse] = await Promise.all([
          supportAPI.getKnowledge({ locale }),
          supportAPI.getContext(),
        ]);

        if (cancelled) return;

        const fetchedArticles = knowledgeResponse.data.articles || [];
        const fetchedContext = contextResponse.data.context || null;

        setArticles(fetchedArticles);
        setSupportContext(fetchedContext);
        setMessages([
          {
            id: createId(),
            role: "assistant",
            text: `${text.intro}${
              fetchedContext?.recentOrders?.length
                ? ` ${locale === "fr" ? "Je vois" : "I can also see"} ${fetchedContext.recentOrders.length} ${locale === "fr" ? "commande(s) recente(s)" : "recent order(s)"} ${locale === "fr" ? "et" : "and"} ${fetchedContext.openTickets} ${locale === "fr" ? "ticket(s) ouvert(s)." : "open ticket(s)."}`
                : ""
            }`,
          },
        ]);
        dispatchChatStatus("ready");
      } catch (error) {
        if (cancelled) return;
        setMessages([
          {
            id: createId(),
            role: "assistant",
            text:
              locale === "fr"
                ? "Le support n'a pas pu charger ses donnees pour le moment. Vous pouvez reessayer ou creer un ticket."
                : "Support data could not be loaded right now. You can try again or create a support ticket.",
          },
        ]);
        dispatchChatStatus(
          "error",
          locale === "fr"
            ? "Le support n'a pas pu charger ses donnees."
            : "Support data could not be loaded.",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAssistant();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isOpen, locale, text.intro, user]);

  const getBestArticle = (question: string) => {
    const normalizedQuestion = normalize(question);
    const terms = normalizedQuestion
      .split(" ")
      .filter((term) => term.length > 2);

    const scored = articles
      .map((article) => {
        const haystack = normalize(
          [
            article.title,
            article.question,
            article.summary,
            article.answer,
            ...(article.tags || []),
            article.category,
          ].join(" "),
        );

        const score = terms.reduce((total, term) => {
          if (haystack.includes(term)) return total + 2;
          return total;
        }, 0);

        return { article, score };
      })
      .sort((left, right) => right.score - left.score);

    return scored[0]?.score > 0 ? scored[0] : null;
  };

  const buildAnswer = (question: string) => {
    const normalizedQuestion = normalize(question);
    const bestMatch = getBestArticle(question);
    const mentionsOrder =
      /(order|commande|payment|paiement|pending|failed|completed)/.test(
        normalizedQuestion,
      );
    const mentionsLoyalty = /(loyalty|points|reward|fidelite|tier|niveau)/.test(
      normalizedQuestion,
    );
    const needsEscalation =
      /(refund|rembourse|key|cle|issue|problem|bug|failed|echec)/.test(
        normalizedQuestion,
      );

    const parts: string[] = [];

    if (bestMatch) {
      parts.push(bestMatch.article.answer);
    }

    if (mentionsOrder && supportContext?.recentOrders?.length) {
      const recentOrder = supportContext.recentOrders[0];
      parts.push(
        locale === "fr"
          ? `Votre commande la plus recente est ${recentOrder._id.slice(-8).toUpperCase()} avec le statut ${recentOrder.status} et un statut de paiement ${recentOrder.paymentStatus}.`
          : `Your most recent order is ${recentOrder._id.slice(-8).toUpperCase()} with status ${recentOrder.status} and payment status ${recentOrder.paymentStatus}.`,
      );
    }

    if (mentionsLoyalty && supportContext?.loyalty) {
      parts.push(
        locale === "fr"
          ? `Votre solde actuel est ${supportContext.loyalty.points} points et votre niveau est ${supportContext.loyalty.tier}.`
          : `Your current balance is ${supportContext.loyalty.points} points and your tier is ${supportContext.loyalty.tier}.`,
      );
    }

    if (!parts.length) {
      parts.push(text.fallback);
    }

    if (needsEscalation) {
      parts.push(
        locale === "fr"
          ? "Ce cas devrait etre transmis au support humain. Vous pouvez utiliser le bouton d'escalade ci-dessous et je joindrai le contexte utile."
          : "This case should be escalated to human support. You can use the escalation button below and I will attach the useful context.",
      );
    }

    return parts.join(" ");
  };

  const submitQuestion = () => {
    const question = input.trim();
    if (!question) return;

    const userMessage: Message = {
      id: createId(),
      role: "user",
      text: question,
    };
    const assistantMessage: Message = {
      id: createId(),
      role: "assistant",
      text: buildAnswer(question),
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
    setTicketMessage(null);
  };

  const handleCreateTicket = async () => {
    if (!lastUserMessage) {
      setTicketMessage(text.noQuestion);
      return;
    }

    try {
      setIsSubmitting(true);
      const summary = buildAnswer(lastUserMessage.text);
      await supportAPI.createTicket({
        subject: lastUserMessage.text.slice(0, 72),
        message: lastUserMessage.text,
        language: locale,
        source: "web",
        aiSummary: summary,
        summary,
      });
      setTicketMessage(text.ticketDone);
    } catch (error) {
      setTicketMessage(
        locale === "fr"
          ? "Le ticket n'a pas pu etre cree. Reessayez dans un instant."
          : "The ticket could not be created. Please try again in a moment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 right-0 z-[111] w-full max-w-[460px] bg-white dark:bg-[#16161f] border-l border-gray-200 dark:border-white/[0.06] shadow-2xl flex flex-col"
            initial={{ opacity: 0, x: 36 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 36 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-gradient-to-r from-primary-600 to-accent-500 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                    <Sparkles className="w-3.5 h-3.5" />
                    {text.title}
                  </div>
                  <h3 className="text-xl font-bold mt-3">{text.title}</h3>
                  <p className="text-sm text-white/75 mt-1">{text.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center text-white/85 hover:bg-white/15 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-500 dark:text-gray-400">
                <div>
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>{text.signIn}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-gray-100 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03]">
                  <div className="flex flex-wrap gap-2">
                    {text.quickPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => setInput(prompt)}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-[#16161f] border border-gray-200 dark:border-white/[0.08] text-sm text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-500/30 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-gray-50/80 dark:bg-[#0f0f17]">
                  {isLoading ? (
                    <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-[#16161f] p-4 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/[0.06]">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                      {text.loading}
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-[0_0_2px_0_rgba(145,158,171,0.2),0_12px_24px_-4px_rgba(145,158,171,0.12)] dark:shadow-none border text-sm leading-relaxed ${
                            message.role === "assistant"
                              ? "bg-white dark:bg-[#16161f] border-gray-200 dark:border-white/[0.06] text-gray-700 dark:text-gray-200"
                              : "bg-gradient-to-r from-primary-600 to-accent-500 border-transparent text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-[0.22em] opacity-75">
                            {message.role === "assistant" ? (
                              <Bot className="w-3.5 h-3.5" />
                            ) : (
                              <User className="w-3.5 h-3.5" />
                            )}
                            {message.role === "assistant"
                              ? text.title
                              : user?.username || "You"}
                          </div>
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-5 border-t border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#16161f]">
                  <AnimatePresence>
                    {ticketMessage && (
                      <motion.div
                        className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
                          ticketMessage === text.ticketDone
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <Ticket className="w-4 h-4" />
                        {ticketMessage}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-2 mb-3">
                    <button
                      type="button"
                      onClick={handleCreateTicket}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Ticket className="w-4 h-4" />
                      )}
                      {isSubmitting ? text.creatingTicket : text.createTicket}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLocale((current) => (current === "en" ? "fr" : "en"))
                      }
                      className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] text-sm font-semibold text-gray-600 dark:text-gray-300"
                    >
                      {locale === "en" ? "FR" : "EN"}
                    </button>
                  </div>

                  <div className="flex items-end gap-3">
                    <textarea
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          submitQuestion();
                        }
                      }}
                      rows={3}
                      placeholder={text.inputPlaceholder}
                      className="flex-1 resize-none px-4 py-3 rounded-2xl border border-gray-200 dark:border-white/[0.08] bg-gray-50 dark:bg-white/[0.04] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={submitQuestion}
                      className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white px-4 py-3 font-bold text-sm hover:shadow-lg hover:shadow-primary-500/25"
                    >
                      <Send className="w-4 h-4" />
                      {text.send}
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
