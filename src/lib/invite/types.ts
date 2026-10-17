export type InviteLookupResult =
  | { kind: "INVALID" }
  | { kind: "TEST"; inviteId: string }
  | { kind: "INVITE_UNUSED"; inviteId: string }
  | { kind: "INVITE_ACTIVE"; inviteId: string }
  | { kind: "INVITE_COMPLETED"; inviteId: string };
