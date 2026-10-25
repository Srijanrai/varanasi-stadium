import { z } from "zod";

// These schemas are the contract for Phase 3: DB tables use the same field names.

export const LISTING_TYPES = ["hotel", "hospital", "temple", "ghat", "transport"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const phone = z.string().regex(/^\+91\d{10}$/, "Use +91XXXXXXXXXX");

export const PhotoSchema = z.object({
  src: z.string(),
  alt: z.string().min(10),
  credit: z.string(),
  // "official-render": published design renders used with credit, pending the owner's permission
  license: z.enum(["own", "owner-permission", "cc-by", "cc-by-sa", "cc0", "unsplash", "official-render"]),
  licenseName: z.string().optional(), // e.g. "CC BY-SA 4.0" — shown in the credit
  licenseUrl: z.string().url().optional(),
  edited: z.string().optional(), // CC licences require saying how we changed the photo
  sourceUrl: z.string().url().optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const TimeSlot = z.object({ name: z.string(), time: z.string(), note: z.string().optional() });

const Base = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "lowercase-hyphenated"),
  name: z.string().min(2),
  nameHi: z.string().optional(),
  area: z.string(),
  address: z.string(),
  pincode: z.string().regex(/^\d{6}$/),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  phone: z.array(phone).default([]),
  whatsapp: phone.optional(),
  website: z.string().url().optional(),
  summary: z.string().min(40).max(170),
  description: z.string(),
  descriptionHi: z.string().optional(),
  photos: z.array(PhotoSchema).default([]),
  tags: z.array(z.string()).default([]),
  quickFacts: z.array(z.string()).default([]),
  /** Where the facts on this page come from (shown on the page, required for official-source verification). */
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  verifiedAt: isoDate.nullable().default(null),
  verificationMethod: z.enum(["phone", "visit", "owner-submitted", "official-source"]).nullable().default(null),
  ownerConsent: z.boolean().default(false),
  status: z.enum(["published", "draft", "hidden"]),
  featured: z.boolean().default(false),
  createdAt: isoDate,
  updatedAt: isoDate,
});

export const HotelSchema = Base.extend({
  type: z.literal("hotel"),
  category: z.enum(["hotel", "guest-house", "homestay", "dharamshala", "hostel"]),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  starRating: z.number().min(1).max(7).optional(),
  amenities: z.array(z.string()).default([]),
  acceptsForeigners: z.boolean().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

export const HospitalSchema = Base.extend({
  type: z.literal("hospital"),
  ownership: z.enum(["government", "private", "trust"]),
  specialties: z.array(z.string()).default([]),
  emergency24x7: z.boolean().optional(),
  opdTimings: z.array(z.object({ days: z.string(), hours: z.string() })).default([]),
  ayushmanBharat: z.boolean().optional(),
});

export const TempleSchema = Base.extend({
  type: z.literal("temple"),
  deity: z.string(),
  openingHours: z.array(TimeSlot).default([]),
  aartiTimings: z.array(TimeSlot).default([]),
  dressCode: z.string().optional(),
  photographyAllowed: z.boolean().optional(),
});

export const GhatSchema = Base.extend({
  type: z.literal("ghat"),
  aarti: z.array(TimeSlot).default([]),
  activities: z.array(z.string()).default([]),
  boatsAvailable: z.boolean().optional(),
});

export const TransportSchema = Base.extend({
  type: z.literal("transport"),
  mode: z.enum(["cab-stand", "auto-stand", "e-rickshaw", "ropeway", "railway", "airport", "bus"]),
  operatingHours: z.string().optional(),
  fareInfo: z.string().optional(),
});

export const ListingSchema = z
  .discriminatedUnion("type", [HotelSchema, HospitalSchema, TempleSchema, GhatSchema, TransportSchema])
  .superRefine((l, ctx) => {
    // Quality gate: a listing can't be published until it's verified, original and has a photo.
    if (l.status !== "published") return;
    const words = l.description.trim().split(/\s+/).length;
    if (words < 150) ctx.addIssue({ code: "custom", message: `description has ${words} words; 150+ required to publish` });
    if (!l.verifiedAt) ctx.addIssue({ code: "custom", message: "verifiedAt required to publish" });
    if (!l.verificationMethod) ctx.addIssue({ code: "custom", message: "verificationMethod required to publish" });
    if (l.photos.length === 0) ctx.addIssue({ code: "custom", message: "at least one photo required to publish" });
    if (l.verificationMethod === "official-source" && l.sources.length === 0)
      ctx.addIssue({ code: "custom", message: "official-source verification needs at least one source link" });
    if (l.verificationMethod === "owner-submitted" && !l.ownerConsent)
      ctx.addIssue({ code: "custom", message: "ownerConsent required for owner-submitted listings" });
    if (l.tags.includes("sample")) ctx.addIssue({ code: "custom", message: "sample listings can never be published" });
    if (/\[(VERIFY|ADD FIRST-HAND)/.test(l.description))
      ctx.addIssue({ code: "custom", message: "remove [VERIFY]/[ADD FIRST-HAND] tags before publishing" });
  });

export type Listing = z.infer<typeof ListingSchema>;
export type Hotel = z.infer<typeof HotelSchema>;
export type Hospital = z.infer<typeof HospitalSchema>;
export type Temple = z.infer<typeof TempleSchema>;
export type Ghat = z.infer<typeof GhatSchema>;
export type Transport = z.infer<typeof TransportSchema>;
export type Photo = z.infer<typeof PhotoSchema>;

export const AreaSchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameHi: z.string().optional(),
  summary: z.string(),
  description: z.string(),
  geo: z.object({ lat: z.number(), lng: z.number() }),
});
export type Area = z.infer<typeof AreaSchema>;

export const MatchSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  competition: z.string(),
  teams: z.array(z.string()).default([]),
  date: z.string().nullable(), // ISO datetime with +05:30 offset
  status: z.enum(["announced", "tentative", "completed"]),
  officialSourceUrl: z.string().url(),
  ticketUrl: z.string().url().optional(),
});
export type Match = z.infer<typeof MatchSchema>;
