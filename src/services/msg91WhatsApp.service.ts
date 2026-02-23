import axios, { AxiosError } from "axios";

const MSG91_WHATSAPP_BASE =
  "https://control.msg91.com/api/v5/whatsapp/whatsapp-outbound-message";

export interface SendWhatsAppTextOptions {
  /** Recipient mobile number with country code (e.g. 919876543210) */
  recipientNumber: string;
  /** Message body (plain text) */
  text: string;
}

/**
 * Send a text message via MSG91 WhatsApp (session-based outbound message).
 * Ref: https://docs.msg91.com/whatsapp/send-message-in-text
 *
 * Requires a 24h session to be started with the recipient (user must have
 * messaged the business number first, or use Send WhatsApp Template for OTP).
 */
export const sendWhatsAppText = async (
  options: SendWhatsAppTextOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const authkey = process.env.MSG91_AUTH_KEY;
  const integratedNumber = process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER;

  if (!authkey || !integratedNumber) {
    console.error(
      "MSG91 WhatsApp: Missing MSG91_AUTH_KEY or MSG91_WHATSAPP_INTEGRATED_NUMBER"
    );
    return { success: false, error: "WhatsApp OTP not configured" };
  }

  const recipientNumber = normalizePhoneForMsg91(options.recipientNumber);

  try {
    const response = await axios.post(
      MSG91_WHATSAPP_BASE,
      {},
      {
        params: {
          integrated_number: integratedNumber,
          recipient_number: recipientNumber,
          content_type: "text",
          text: options.text,
        },
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authkey,
        },
        timeout: 15000,
      }
    );

    const data = response.data as { request_id?: string; type?: string };
    return {
      success: true,
      ...(data.request_id != null && { messageId: data.request_id }),
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;
    const body = axiosError.response?.data;
    const errorMessage =
      (body && typeof body === "object" && "message" in body
        ? (body as { message?: string }).message
        : null) ||
      axiosError.message ||
      "Unknown MSG91 error";
    console.error(
      `MSG91 WhatsApp send failed (${status}):`,
      errorMessage,
      body ?? ""
    );
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Normalize phone for MSG91: digits only, ensure country code.
 * If number doesn't start with a country code, prepend 91 (India).
 */
function normalizePhoneForMsg91(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 10) {
    return "91" + digits;
  }
  return digits;
}
