"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { User as UserIcon, Users, Check } from "lucide-react";
import {
  PLATFORM_COMMUNITIES,
  PlatformCommunityMeta,
  getFollowedProfilesMap,
  toggleFollowProfile,
  getJoinedCommunitiesMap,
  setCommunityJoined,
  normalizeHandle,
} from "@/lib/persistence";
import CommunityInfoModal from "@/components/CommunityInfoModal";

const RECOMMENDED_FOR_USERS = [
  {
    id: "rec-1",
    username: "oliviacastro_901",
    name: "Olívia Castro",
    role: "USUARIO" as const,
    headline: "Desenvolvedora Front-end & UI Designer",
  },
  {
    id: "rec-2",
    username: "arthur_gimax",
    name: "Arthur Henrique Gimax",
    role: "USUARIO" as const,
    headline: "Analista de Dados Jr • Python & SQL",
  },
  {
    id: "rec-3",
    username: "leilapereira_1951",
    name: "Leila Ferreira Castro",
    role: "USUARIO" as const,
    headline: "Product Designer & Pesquisadora UX",
  },
  {
    id: "rec-4",
    username: "_brunoocalos321",
    name: "Bruno Ferreira",
    role: "USUARIO" as const,
    headline: "Desenvolvedor Full-Stack • Node.js & React",
  },
];

const TALENTS_FOR_COMPANIES = [
  {
    id: "tal-1",
    username: "oliviacastro_901",
    name: "Olívia Castro • Front-end & UI",
    role: "USUARIO" as const,
    headline: "Desenvolvedora Front-end & UI Designer",
  },
  {
    id: "tal-2",
    username: "arthur_gimax",
    name: "Arthur Gimax • Dados & SQL",
    role: "USUARIO" as const,
    headline: "Analista de Dados Jr • Python & SQL",
  },
  {
    id: "tal-3",
    username: "leilapereira_1951",
    name: "Leila Castro • Product Design",
    role: "USUARIO" as const,
    headline: "Product Designer & Pesquisadora UX",
  },
  {
    id: "tal-4",
    username: "_brunoocalos321",
    name: "Bruno Ferreira • Node.js & React",
    role: "USUARIO" as const,
    headline: "Desenvolvedor Full-Stack • Node.js & React",
  },
];

const USER_COMMUNITY_IDS = [
  "com-empreender",
  "com-vagas-pvh",
  "com-enfermagem",
  "com-ideias-futuro",
  "com-projetos-ascensao",
];

const COMPANY_COMMUNITY_IDS = [
  "com-talentos-tech-ro",
  "com-recrutamento-univ",
  "com-ideias-futuro",
  "com-parceiros-estagio",
  "com-feira-carreiras",
];

interface RightSidebarWidgetsProps {
  role?: "USUARIO" | "EMPRESA";
  userId?: string;
  currentUsername?: string;
}

export default function RightSidebarWidgets({
  role = "USUARIO",
  userId = "default-user",
  currentUsername = "",
}: RightSidebarWidgetsProps) {
  const [followedMap, setFollowedMap] = useState<Record<string, boolean>>({});
  const [joinedComms, setJoinedComms] = useState<Record<string, boolean>>({});
  const [previewCommunity, setPreviewCommunity] =
    useState<PlatformCommunityMeta | null>(null);

  const syncFromStorage = useCallback(() => {
    const fMap = getFollowedProfilesMap(userId);
    const boolFollow: Record<string, boolean> = {};
    for (const k of Object.keys(fMap)) {
      boolFollow[k] = true;
    }
    setFollowedMap(boolFollow);
    setJoinedComms(getJoinedCommunitiesMap(userId));
  }, [userId]);

  useEffect(() => {
    syncFromStorage();
    const handler = () => syncFromStorage();
    window.addEventListener("heston:state", handler);
    return () => window.removeEventListener("heston:state", handler);
  }, [syncFromStorage]);

  const isCompany = role === "EMPRESA";
  const rawProfilesList = isCompany
    ? TALENTS_FOR_COMPANIES
    : RECOMMENDED_FOR_USERS;

  // Nunca exibir o próprio usuário logado para seguir a si mesmo
  const ownHandle = normalizeHandle(currentUsername);
  const profilesList = rawProfilesList.filter(
    (p) => normalizeHandle(p.username) !== ownHandle
  );

  const targetCommIds = isCompany ? COMPANY_COMMUNITY_IDS : USER_COMMUNITY_IDS;
  const communitiesList = targetCommIds
    .map((id) => PLATFORM_COMMUNITIES.find((c) => c.id === id))
    .filter((c): c is PlatformCommunityMeta => Boolean(c));

  function handleToggleFollow(prof: (typeof RECOMMENDED_FOR_USERS)[number]) {
    toggleFollowProfile(userId, {
      handle: normalizeHandle(prof.username),
      name: prof.name.split("•")[0].trim(),
      username: `@${normalizeHandle(prof.username)}`,
      role: prof.role,
      headline: prof.headline,
    });
    syncFromStorage();
  }

  function handleToggleJoinCommunity(commId: string, nextJoined?: boolean) {
    const targetState =
      nextJoined !== undefined ? nextJoined : !joinedComms[commId];
    const updated = setCommunityJoined(userId, commId, targetState);
    setJoinedComms(updated);
  }

  return (
    <>
      {/* Widget Recomendações (Usuário) / Talentos em Destaque (Empresa) */}
      <div className="rounded-3xl border border-zinc-800/90 bg-[#09090B] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold tracking-tight">
            {isCompany ? "Talentos em Destaque" : "Recomendações"}
          </h2>
          {isCompany && (
            <span className="px-2 py-0.5 rounded-full bg-[#087E96]/20 text-cyan-300 text-[9px] font-extrabold">
              Recrutamento
            </span>
          )}
        </div>

        <div className="space-y-3.5">
          {profilesList.map((prof) => {
            const handle = normalizeHandle(prof.username);
            const isFollowing = Boolean(followedMap[handle]);
            return (
              <div
                key={prof.id}
                className="flex items-center justify-between gap-2"
              >
                <Link
                  href={`/perfil?user=${encodeURIComponent(prof.username)}`}
                  className="flex items-center gap-2.5 min-w-0 group"
                >
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 group-hover:border-[#087E96] flex items-center justify-center text-zinc-300 shrink-0 transition">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-[#38bdf8] truncate transition">
                      @{prof.username}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {prof.name}
                    </p>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => handleToggleFollow(prof)}
                  className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold transition shrink-0 ${
                    isFollowing
                      ? "bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isFollowing
                    ? "Seguindo"
                    : isCompany
                    ? "Conectar"
                    : "Seguir"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget Comunidades (Clicável para abrir Modal de Detalhes antes ou depois de entrar) */}
      <div className="rounded-3xl border border-zinc-800/90 bg-[#09090B] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold tracking-tight">Comunidades</h2>
          <span className="text-[10px] text-zinc-400">Clique para ver</span>
        </div>
        <div className="space-y-3.5">
          {communitiesList.map((comm) => {
            const isJoined = Boolean(joinedComms[comm.id]);
            return (
              <div
                key={comm.id}
                className="flex items-center justify-between gap-2"
              >
                <button
                  type="button"
                  onClick={() => setPreviewCommunity(comm)}
                  className="flex items-center gap-2.5 min-w-0 text-left group flex-1"
                >
                  <div
                    className={`w-9 h-9 rounded-full ${comm.badgeBg} flex items-center justify-center text-white shrink-0 group-hover:ring-2 group-hover:ring-white/40 transition`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-[#38bdf8] truncate transition">
                      {comm.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {comm.membersCount + (isJoined ? 1 : 0)} membros
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    isJoined
                      ? setPreviewCommunity(comm)
                      : handleToggleJoinCommunity(comm.id, true)
                  }
                  className={`px-3 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 transition shrink-0 ${
                    isJoined
                      ? "bg-[#087E96]/25 text-cyan-300 border border-[#087E96]"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isJoined ? (
                    <>
                      <span>Membro</span>
                      <Check className="w-3 h-3" />
                    </>
                  ) : (
                    <span>Entrar</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Informações da Comunidade antes/depois de entrar */}
      <CommunityInfoModal
        community={previewCommunity}
        isJoined={
          previewCommunity ? Boolean(joinedComms[previewCommunity.id]) : false
        }
        onClose={() => setPreviewCommunity(null)}
        onToggleJoin={(commId, nextJoined) =>
          handleToggleJoinCommunity(commId, nextJoined)
        }
      />
    </>
  );
}
