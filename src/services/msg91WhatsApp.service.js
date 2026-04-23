"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppText = void 0;
const axios_1 = require("axios");
const MSG91_WHATSAPP_BASE = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";
/**
 * Send a text message via MSG91 WhatsApp (session-based outbound message).
 * Ref: https://docs.msg91.com/whatsapp/send-message-in-text
 *
 * Requires a 24h session to be started with the recipient (user must have
 * messaged the business number first, or use Send WhatsApp Template for OTP).
 */
const sendWhatsAppText = async (options) => {
    const authkey = process.env.MSG91_AUTH_KEY;
    const integratedNumber = process.env.MSG91_WHATSAPP_INTEGRATED_NUMBER;
    if (!authkey || !integratedNumber) {
        console.error("MSG91 WhatsApp: Missing MSG91_AUTH_KEY or MSG91_WHATSAPP_INTEGRATED_NUMBER", {
            hasAuthKey: !!authkey,
            hasIntegratedNumber: !!integratedNumber,
        });
        return { success: false, error: "WhatsApp OTP not configured" };
    }
    const recipientNumber = normalizePhoneForMsg91(options.recipientNumber);
    const templateName = process.env.MSG91_TEMPLATE_NAME || "otp_templete";
    const templateNamespace = process.env.MSG91_TEMPLATE_NAMESPACE ||
        "e4734292_b71d_41f3_9f9a_b661b6739954";
    const requestBody = {
        integrated_number: integratedNumber,
        content_type: "template",
        payload: {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: templateName,
                language: {
                    code: "en",
                    policy: "deterministic",
                },
                namespace: templateNamespace,
                to_and_components: [
                    {
                        to: [recipientNumber],
                        components: {
                            body_1: {
                                type: "text",
                                value: options.text,
                            },
                            button_1: {
                                subtype: "url",
                                type: "text",
                                value: options.text,
                            }
                        },
                    },
                ],
            },
        },
    };
    console.log("MSG91 WhatsApp: preparing to send template", {
        to: recipientNumber,
        templateName,
        templateNamespace,
    });
    try {
        const response = await axios_1.default.post(MSG91_WHATSAPP_BASE, requestBody, {
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                authkey,
            },
            timeout: 15000,
        });
        const data = response.data;
        console.log("MSG91 WhatsApp: message sent successfully", {
            to: recipientNumber,
            messageId: data.request_id,
            type: data.type,
        });
        return {
            success: true,
            ...(data.request_id != null && { messageId: data.request_id }),
        };
    }
    catch (err) {
        const axiosError = err;
        const status = axiosError.response?.status;
        const body = axiosError.response?.data;
        const errorMessage = (body && typeof body === "object" && "message" in body
            ? body.message
            : null) ||
            axiosError.message ||
            "Unknown MSG91 error";
        console.error(`MSG91 WhatsApp send failed (${status}):`, errorMessage, {
            to: recipientNumber,
            responseBody: body ?? "",
        });
        return {
            success: false,
            error: errorMessage,
        };
    }
};
exports.sendWhatsAppText = sendWhatsAppText;
/**
 * Normalize phone for MSG91: digits only, ensure country code.
 * If number doesn't start with a country code, prepend 91 (India).
 */
function normalizePhoneForMsg91(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length <= 10) {
        return "91" + digits;
    }
    return digits;
}
//# sourceMappingURL=msg91WhatsApp.service.js.map