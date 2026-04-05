/**
 * Telegram Notification Service
 * Sends formatted event notifications to a Telegram bot.
 *
 * Env vars required:
 *   TELEGRAM_BOT_TOKEN  — bot token from @BotFather
 *   TELEGRAM_CHAT_ID    — target chat / channel / group ID
 */

import axios from "axios";
import UserModel from "../models/schema/User.schema";
import AddressModel from "../models/schema/Address.scema";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// ─── Core send ────────────────────────────────────────────────────────────────

async function send(html: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("[Telegram] BOT_TOKEN or CHAT_ID not set — skipping notification");
    return;
  }

  try {
    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      },
      { timeout: 8000 }
    );
    console.log("[Telegram] Notification sent successfully");
  } catch (err: any) {
    // Never throw — notifications must never crash the main flow
    console.error("[Telegram] Failed to send notification:", err?.response?.data || err?.message);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (date: Date | string | undefined) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      })
    : "—";

/** Appends a collapsible raw JSON block. Telegram renders <pre> with a native Copy button. */
const jsonBlock = (obj: any): string => {
  const raw = JSON.stringify(obj, null, 2);
  // Telegram message limit is 4096 chars; truncate if huge
  const truncated = raw.length > 1800 ? raw.slice(0, 1800) + "\n... (truncated)" : raw;
  return `\n\n📋 <b>Raw JSON</b>\n<pre><code class="language-json">${escHtml(truncated)}</code></pre>`;
};

/** Escape HTML special chars for Telegram HTML parse mode */
const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const line = (emoji: string, label: string, value: any) =>
  value !== undefined && value !== null && value !== ""
    ? `${emoji} <b>${label}:</b> ${escHtml(String(value))}\n`
    : "";

/** Fetch minimal user info from DB. Returns a display string like "John Doe • +91 98241 57811" */
async function fetchUser(userId: any): Promise<{ name: string; phone: string } | null> {
  try {
    const u = await UserModel.findById(userId).select("firstName lastName phoneNo").lean();
    if (!u) return null;
    const name = `${(u as any).firstName ?? ""} ${(u as any).lastName ?? ""}`.trim() || "Unknown";
    return { name, phone: (u as any).phoneNo ?? "—" };
  } catch {
    return null;
  }
}

/** Renders a user block: Name + Phone on two lines */
const userLines = (u: { name: string; phone: string } | null, fallbackId?: any) =>
  u
    ? line("👤", "User", u.name) + line("📱", "Phone", u.phone)
    : line("👤", "User ID", fallbackId?.toString());

/** Fetch address and format as a single readable string */
async function fetchAddress(addressId: any): Promise<string | null> {
  try {
    const a = await AddressModel.findById(addressId)
      .select("title house_no society_name address_line_one address_line_two area city state pin_code country")
      .lean() as any;
    if (!a) return null;

    const parts = [
      a.title ? `[${a.title}]` : null,
      a.house_no,
      a.society_name,
      a.address_line_one,
      a.address_line_two,
      a.area,
      a.city,
      a.state,
      a.pin_code ? `- ${a.pin_code}` : null,
      a.country,
    ].filter(Boolean);

    return parts.join(", ");
  } catch {
    return null;
  }
}

// ─── Formatters ───────────────────────────────────────────────────────────────

export async function notifyNewUser(user: any): Promise<void> {
  const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown";
  const html =
    `🆕 <b>New User Registered</b>\n` +
    `${"─".repeat(28)}\n` +
    line("👤", "Name", name) +
    line("📱", "Phone", user.phoneNo) +
    line("📧", "Email", user.email) +
    line("🔖", "Username", user.username) +
    line("🏷", "Type", user.userType) +
    line("🆔", "User ID", user._id?.toString()) +
    line("📅", "Registered", fmt(user.createdAt)) +
    jsonBlock(user);

  await send(html);
}

export async function notifyComplaintCreated(complaint: any): Promise<void> {
  const [u, address] = await Promise.all([
    fetchUser(complaint.user),
    fetchAddress(complaint.addressId),
  ]);

  const html =
    `🔧 <b>New Complaint Created</b>\n` +
    `${"─".repeat(28)}\n` +
    line("🆔", "Complaint ID", complaint._id?.toString()) +
    line("📌", "Title", complaint.title) +
    userLines(u, complaint.user) +
    line("📍", "Address", address) +
    line("🛠", "Provider", complaint.provider?.toString() || "Unassigned") +
    line("📟", "Device Type", complaint.deviceTypeId) +
    line("🗂", "Stage", complaint.stage) +
    line("💳", "Subscription", complaint.subscriptionId ? `#${complaint.subscriptionId}` : "None") +
    line("💰", "Total Amount", complaint.totalAmount ? `₹${complaint.totalAmount}` : "—") +
    line("📝", "Notes", complaint.notes) +
    line("📅", "Created", fmt(complaint.createdAt)) +
    jsonBlock(complaint);

  await send(html);
}

export async function notifyComplaintUpdated(complaint: any, changes?: Record<string, any>): Promise<void> {
  const u = await fetchUser(complaint.user);

  let changesBlock = "";
  if (changes && Object.keys(changes).length > 0) {
    const lines = Object.entries(changes)
      .map(([k, v]) => `  • <b>${escHtml(k)}:</b> ${escHtml(String(v))}`)
      .join("\n");
    changesBlock = `\n✏️ <b>Changes:</b>\n${lines}\n`;
  }

  const html =
    `🔄 <b>Complaint Updated</b>\n` +
    `${"─".repeat(28)}\n` +
    line("🆔", "Complaint ID", complaint._id?.toString()) +
    line("📌", "Title", complaint.title) +
    userLines(u, complaint.user) +
    line("🗂", "Stage", complaint.stage) +
    line("💰", "Total Amount", complaint.totalAmount ? `₹${complaint.totalAmount}` : "—") +
    line("💳", "Payment Status", complaint.paymentVerificationStatus) +
    line("📅", "Updated", fmt(complaint.updatedAt)) +
    changesBlock +
    jsonBlock(complaint);

  await send(html);
}

export async function notifySubscriptionCreated(sub: any): Promise<void> {
  const snap = sub.plan_snapshot ?? {};
  const pricing = snap.pricing ?? {};
  const addons = (sub.addons_snapshot ?? []).map((a: any) => a.name).join(", ") || "None";
  const u = await fetchUser(sub.user);

  const html =
    `💳 <b>New Subscription Registered</b>\n` +
    `${"─".repeat(28)}\n` +
    line("🆔", "Subscription ID", sub._id?.toString()) +
    userLines(u, sub.user) +
    line("📦", "Plan", snap.name) +
    line("🏷", "Plan Type", snap.plan_type) +
    line("🔢", "Total Services", snap.totalServices) +
    line("⏳", "Validity", snap.validityDuration ? `${snap.validityDuration} months` : "—") +
    line("💵", "Amount Due", pricing.sub_sales ? `₹${pricing.sub_sales}` : "—") +
    line("🎁", "Max Cashback", snap.maxDiscount ? `₹${snap.maxDiscount}` : "—") +
    line("🔄", "Payment Model", sub.paymentModel) +
    line("🧩", "Addons", addons) +
    line("📅", "Starts", fmt(sub.startDate)) +
    line("📅", "Expires", fmt(sub.expiryDate)) +
    line("⚡", "Status", sub.status) +
    jsonBlock(sub);

  await send(html);
}

export async function notifyWaitlistJoin(params: {
  phoneNo: string;
  countryCode: string;
  source: string;
  joinedAt: Date | string;
}): Promise<void> {
  const { phoneNo, countryCode, source, joinedAt } = params;

  const html =
    `📋 <b>New Waitlist Sign-up</b>\n` +
    `${"─".repeat(28)}\n` +
    line("📱", "Phone", `${countryCode}${phoneNo}`) +
    line("🌐", "Source", source) +
    line("📅", "Joined At", fmt(joinedAt));

  await send(html);
}

export async function notifyPaymentVerified(params: {
  sub: any;
  amountRupees: number;
  paymentId: string;
  paymentRef: string;
}): Promise<void> {
  const { sub, amountRupees, paymentId, paymentRef } = params;
  const snap = sub.plan_snapshot ?? {};
  const u = await fetchUser(sub.user);

  const html =
    `💰 <b>Payment Verified — Subscription Activated</b>\n` +
    `${"─".repeat(28)}\n` +
    line("🆔", "Subscription ID", sub._id?.toString()) +
    userLines(u, sub.user) +
    line("📦", "Plan", snap.name) +
    line("💵", "Amount Paid", `₹${amountRupees}`) +
    line("💳", "Total Paid", `₹${sub.totalPaid}`) +
    line("📉", "Remaining", `₹${sub.remainingAmount}`) +
    line("🔑", "Razorpay ID", paymentId) +
    line("🏷", "Payment Ref", paymentRef) +
    line("⚡", "Subscription Status", sub.status) +
    line("🎁", "Max Cashback", snap.maxDiscount ? `₹${snap.maxDiscount}` : "—") +
    line("📅", "Activated", fmt(new Date())) +
    jsonBlock({ subscriptionId: sub._id, user: sub.user, amountRupees, paymentId, paymentRef, plan: snap.name, status: sub.status, totalPaid: sub.totalPaid, remainingAmount: sub.remainingAmount });

  await send(html);
}
