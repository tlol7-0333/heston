"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User as UserIcon, Users } from "lucide-react";

const RECOMMENDED_FOR_USERS = [
  {
    id: "rec-1",
    username: "oliviacastro_901",
    name: "Olívia Castro",
  },
  {
    id: "rec-2",
    username: "arthur_gimax",
    name: "Arthur Henrique Gimax",
  },
  {
    id: "rec-3",
    username: "leilapereira_1951",
    name: "Leila Ferreira Castro",
  },
  {
    id: "rec-4",
    username: "_brunoocalos321",
    name: "Bruno Ferreira",
  },
];

const TALENTS_FOR_COMPANIES = [
  {
    id: "tal-1",
    username: "oliviacastro_dev",
    name: "Olívia Castro • Front-end & UI",
  },
  {
    id: "tal-2",
    username: "arthur_dados",
    name: "Arthur Gimax • Dados & SQL",
  },
  {
    id: "tal-3",
    username: "leila_uxdesign",
    name: "Leila Castro • Product Design",
  },
  {
    id: "tal-4",
    username: "bruno_fullstack",
    name: "Bruno Ferreira • Node.js & React",
  },
];

const COMMUNITIES_FOR_USERS = [
  {
    id: "com-1",
    name: "Empreender+",
    color: "bg-indigo-600",
  },
  {
    id: "com-2",
    name: "Vagas em Porto Velho",
    color: "bg-emerald-600",
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
    color: "bg-amber-600",
  },
];

const COMMUNITIES_FOR_COMPANIES = [
  {
    id: "ccom-1",
    name: "Talentos Tech RO",
    color: "bg-[#087E96]",
  },
  {
    id: "ccom-2",
    name: "Recrutamento Universitário",
    color: "bg-indigo-600",
  },
  {
    id: "ccom-3",
    name: "Inovação & Startups",
    color: "bg-purple-600",
  },
  {
    id: "ccom-4",
    name: "Parceiros Estágio+",
    color: "bg-emerald-600",
  },
  {
    id: "ccom-5",
    name: "Feira de Carreiras Heston",
    color: "bg-amber-600",
  },
];

interface RightSidebarWidgetsProps {
  role?: "USUARIO" | "EMPRESA";
}

export default function RightSidebarWidgets({
  role = "USUARIO",
}: RightSidebarWidgetsProps) {
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [joinedComms, setJoinedComms] = useState<Record<string, boolean>>({});

  const isCompany = role === "EMPRESA";
  const profilesList = isCompany
    ? TALENTS_FOR_COMPANIES
    : RECOMMENDED_FOR_USERS;
  const communitiesList = isCompany
    ? COMMUNITIES_FOR_COMPANIES
    : COMMUNITIES_FOR_USERS;

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
            const isFollowing = Boolean(followedIds[prof.id]);
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
                      {prof.username}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">
                      {prof.name}
                    </p>
                  </div>
                </Link>
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

      {/* Widget Comunidades */}
      <div className="rounded-3xl border border-zinc-800/90 bg-[#09090B] p-5 space-y-4">
        <h2 className="text-sm font-extrabold tracking-tight">Comunidades</h2>
        <div className="space-y-3.5">
          {communitiesList.map((comm) => {
            const isJoined = Boolean(joinedComms[comm.id]);
            return (
              <div
                key={comm.id}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full ${comm.color} flex items-center justify-center text-white shrink-0`}
                  >
                    <Users className="w-4 h-4" />
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
