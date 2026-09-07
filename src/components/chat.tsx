"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquareText, Users } from "lucide-react";
import { useApp } from "@/lib/store";
import { Role } from "@/lib/data";
import { Avatar, Badge } from "./ui";

export function ThreadChat({ role, accent = "#818cf8" }: { role: Role; accent?: string }) {
  const { threads, sendMessage } = useApp();
  const mine = threads.filter((t) => t.role === role);
  const [activeId, setActiveId] = useState(mine[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const active = mine.find((t) => t.id === activeId) ?? mine[0];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.msgs.length]);

  if (!mine.length) return null;
  const send = () => {
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim());
    setDraft("");
  };
  return (
    <div className="grid md:grid-cols-[280px_1fr] gap-5">
      <div className="space-y-2.5">
        {mine.map((t, i) => (
          <motion.button key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            onClick={() => setActiveId(t.id)}
            className={`w-full text-left glass rounded-xl p-3.5 flex items-center gap-3 transition-all ${active?.id === t.id ? "ring-glow border-transparent" : "hover:border-white/20"}`}>
            <Avatar name={t.with} id={t.id} size={38} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">{t.with}</p>
              <p className="text-[10px] text-slate-500 truncate">{t.msgs[t.msgs.length - 1]?.text}</p>
            </div>
            <span className="text-[9px] text-slate-600 shrink-0">{t.msgs[t.msgs.length - 1]?.ts}</span>
          </motion.button>
        ))}
        <div className="glass-soft rounded-xl p-3.5 flex items-center gap-2.5 text-slate-500 text-[11px]">
          <Users size={13} /> {mine.length} active spaces · read receipts on
        </div>
      </div>
      {active && (
        <div className="glass rounded-2xl flex flex-col overflow-hidden min-h-[480px]">
          <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3 bg-white/[0.02]">
            <Avatar name={active.with} id={active.id} size={34} />
            <div>
              <p className="text-sm font-semibold text-white">{active.with}</p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {active.subtitle}</p>
            </div>
            <div className="ml-auto"><Badge tone="green" dot>Online</Badge></div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[420px]">
            {active.msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${m.from === "me" ? "text-white rounded-br-md" : "glass-soft text-slate-200 rounded-bl-md"}`}
                  style={m.from === "me" ? { background: `linear-gradient(135deg, ${accent}cc, ${accent}88)` } : {}}>
                  {m.text}
                  <p className={`text-[9px] mt-1 ${m.from === "me" ? "text-white/60 text-right" : "text-slate-500"}`}>{m.ts}</p>
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="p-3.5 border-t border-white/8 flex gap-2.5">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={`Message ${active.with.split("(")[0].trim()}…`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-400/60 transition" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={send} className="w-11 h-11 rounded-xl grid place-items-center text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}99)` }}>
              <Send size={16} />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
