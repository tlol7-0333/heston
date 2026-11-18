"use client";

import React, { useState } from "react";

const RECOMMENDED_PROFILES = [
  {
    id: "rec-1",
    username: "oliviacastro_901",
    name: "Olívia Castro",
    color: "from-rose-500 to-orange-500",
  },
  {
    id: "rec-2",
    username: "arthur_gimax",
    name: "Arthur Henrique Gimax",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "rec-3",
    username: "leilapereira_1951",
    name: "Leila Ferreira Castro",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: "rec-4",
    username: "_brunoocalos321",
    name: "Bruno Ferreira",
    color: "from-amber-500 to-yellow-600",
  },
];

const FEATURED_COMMUNITIES = [
  {
    id: "com-1",
    name: "Empreender+",
    color: "bg-indigo-600",
  },
  {
    id: "com-2",
    name: "Vagas em Porto Velho",
    color: "bg-emerald-500",
  },
  {
    id: "com-3",
    name: "Técnicos em enfermagem",
    color: "bg-rose-600",
  },
  {
    id: "com-4",
    name: "Ideias do futuro",
    color: "bg-purple-600",
  },
  {
    id: "com-5",
    name: "Projetos em ascensão",
    color: "bg-orange-500",
  },
];

export default function RightSidebarWidgets() {
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [joinedComms, setJoinedComms] = useState<Record<string, boolean>>({});

  return (
    <>
      {/* Widget Recomendações */}
      <div className="rounded-3xl border border-zinc-800 bg-[#09090B] p-5 space-y-4">
        <h2 className="text-base font-extrabold tracking-tight">
          Recomendações
        </h2>
        <div className="space-y-3.5">
          {RECOMMENDED_PROFILES.map((prof) => {
            const isFollowing = Boolean(followedIds[prof.id]);
            return (
              <div
                key={prof.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-tr ${prof.color} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}
                  >
                    {prof.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {prof.username}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {prof.name}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFollowedIds((prev) => ({
                      ...prev,
                      [prof.id]: !prev[prof.id],
                    }))
                  }
                  className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold transition shrink-0 ${
                    isFollowing
                      ? "bg-zinc-800 text-zinc-200 border border-zinc-700"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isFollowing ? "Seguindo" : "Seguir"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget Comunidades */}
      <div className="rounded-3xl border border-zinc-800 bg-[#09090B] p-5 space-y-4">
        <h2 className="text-base font-extrabold tracking-tight">Comunidades</h2>
        <div className="space-y-3.5">
          {FEATURED_COMMUNITIES.map((comm) => {
            const isJoined = Boolean(joinedComms[comm.id]);
            return (
              <div
                key={comm.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${comm.color} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}
                  >
                    {comm.name[0]}
                  </div>
                  <p className="text-xs font-bold text-white truncate">
                    {comm.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setJoinedComms((prev) => ({
                      ...prev,
                      [comm.id]: !prev[comm.id],
                    }))
                  }
                  className={`px-3.5 py-1 rounded-full text-[10px] font-extrabold transition shrink-0 ${
                    isJoined
                      ? "bg-[#087E96]/25 text-cyan-300 border border-[#087E96]"
                      : "bg-white hover:bg-zinc-200 text-black"
                  }`}
                >
                  {isJoined ? "Membro" : "Entrar"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
