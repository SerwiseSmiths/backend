import * as ContactRepo from "../repositories/contact.repo";
import { IContactEntry } from "../types/contact.type";
import ApiSuccess from "../utils/api/ApiSuccess.api.util";
import ApiError from "../utils/api/ApiError.api.util";

export const syncContacts = async (ownerId: string, contacts: IContactEntry[]) => {
  if (!Array.isArray(contacts)) {
    throw new ApiError(400, "contacts must be an array");
  }

  // Sanitise: keep only entries that have at least one phone number
  const sanitised = contacts
    .filter((c) => Array.isArray(c.phoneNumbers) && c.phoneNumbers.length > 0)
    .map((c) => {
      const entry: IContactEntry = {
        name: c.name ?? "",
        phoneNumbers: c.phoneNumbers.map((p) => ({
          label: p.label ?? "mobile",
          number: p.number,
        })),
        emailAddresses: (c.emailAddresses ?? []).map((e) => ({
          label: e.label ?? "home",
          email: e.email,
        })),
      };

      if (c.deviceRecordId) {
        entry.deviceRecordId = c.deviceRecordId;
      }

      return entry;
    });

  const doc = await ContactRepo.upsertContacts(ownerId, sanitised);

  return new ApiSuccess(200, "Contacts synced successfully", {
    totalSynced: sanitised.length,
    lastSynced: doc.lastSynced,
  });
};

export const getContacts = async (ownerId: string) => {
  const doc = await ContactRepo.getContactsByOwner(ownerId);
  return new ApiSuccess(200, "Contacts fetched successfully", {
    contacts: doc?.contacts ?? [],
    lastSynced: doc?.lastSynced ?? null,
  });
};
