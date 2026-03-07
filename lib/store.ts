"use client";

import { Participant } from "./questions";

const STORAGE_KEY = "quiz_participants";

export function getParticipants(): Participant[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveParticipant(participant: Participant): void {
  if (typeof window === "undefined") return;
  const participants = getParticipants();
  const existing = participants.findIndex((p) => p.id === participant.id);
  if (existing >= 0) {
    participants[existing] = participant;
  } else {
    participants.push(participant);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

export function clearParticipants(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function hasAttempted(phone: string): boolean {
  const participants = getParticipants();
  return participants.some((p) => p.phone === phone);
}