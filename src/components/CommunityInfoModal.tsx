"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  X,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { PlatformCommunityMeta } from "@/lib/persistence";

interface CommunityInfoModalProps {
  community: PlatformCommunityMeta | null;
  isJoined: boolean;
  onClose: () => void;
  onToggleJoin: (communityId: string, nextJoined: boolean) => void;
  onOpenChatInNotas?: (communityId: string) => void;
}

export default function CommunityInfoModal({
  community,
  isJoined,
  onClose,
  onToggleJoin,
  onOpenChatInNotas,
}: CommunityInfoModalProps) {
  const router = useRouter();

  if (!community) return null;

  function handleOpenInNotas() {
    if (!community) return;
    onClose();
    if (onOpenChatInNotas) {
      onOpenChatInNotas(community.id);
    } else {
      router.push(`/notas?community=${encodeURIComponent(community.id)}`);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#111114] border border-zinc-800 shadow-2xl overflow-hidden my-auto">
        {/* Header em Gradiente da Comunidade */}
        <div
          className={`bg-gradient-to-br ${community.color} p-6 text-white relative`}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-black/25 backdrop-blur-sm border border-white/25 flex items-center justify-center text-white shadow-lg shrink-0">
              <Users className="w-7 h-7" />
            </div>

            <div className="min-w-0">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/30 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                {community.category}
              </span>
              <h3 className="text-xl font-extrabold leading-snug truncate">
                {community.name}
              </h3>
              <p className="text-xs font-semibold text-white/90 flex items-center gap-2 mt-0.5">
                <span>
                  {community.membersCount + (isJoined ? 1 : 0)} membros
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  <span>{community.onlineCount} online</span>
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 space-y-5">
          {/* Sobre a Comunidade */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sobre a Comunidade</span>
            </h4>
            <p className="text-xs text-zinc-200 leading-relaxed">
              {community.description}
            </p>
          </div>

          {/* Regras Rápidas */}
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-3.5 space-y-2">
            <span className="text-[11px] font-extrabold text-zinc-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087E96]" />
              <span>Diretrizes e Temas do Grupo</span>
            </span>
            <ul className="space-y-1 text-[11px] text-zinc-400 list-disc list-inside">
              {community.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>

          {/* Prévia de 2 Tópicos Recentes */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#087E96]" />
              <span>Prévia de Tópicos Recentes</span>
            </h4>
            <div className="space-y-2">
              {community.recentTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#0B0B0E] border border-zinc-800/90 p-3 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white truncate">
                      {topic.author}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[9px] font-bold">
                        {topic.role}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {topic.time}
                      </span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    {topic.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {isJoined ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenInNotas}
                  className="w-full sm:flex-1 h-11 rounded-full bg-[#087E96] hover:bg-[#0a93af] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <span>Abrir Chat da Comunidade em Notas</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onToggleJoin(community.id, false)}
                  className="w-full sm:w-auto px-4 h-11 rounded-full bg-zinc-900 hover:bg-red-950/40 border border-zinc-700 hover:border-red-500/50 text-zinc-300 hover:text-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair da comunidade</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onToggleJoin(community.id, true)}
                  className="w-full sm:flex-1 h-11 rounded-full bg-gradient-to-r from-[#087E96] via-purple-500 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Entrar na Comunidade</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 h-11 rounded-full border border-zinc-700 hover:border-white text-xs font-bold text-zinc-300 hover:text-white transition"
                >
                  Fechar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
