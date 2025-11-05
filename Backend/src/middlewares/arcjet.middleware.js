import aj from '../lib/arcjet.js';
import { isSpoofedBot } from "@arcjet/inspect";
import { throw500 } from '../lib/utils.js';


export const arcjetProtection = async (req, res, next) => {
    try {
        const decision = await aj.protect(req);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                console.log("rate limit")
                return res.status(429).json({
                    success: false,
                    message: "Rate limit exceeded, Please try again later"
                })
            }
            else if (decision.reason.isBot()) {
                return res.status(403).json({ success: false, message: "Bot access denied." })
            } else {
                return res.status(403).json({ success: false, message: "Access denined by secuiry policy." })
            }
        }

        // check for spoofed bots
        if (decision.results.some(isSpoofedBot)) {
            return res.status(403)
                .json({
                    success: false,
                    message: "Malicious bot activity detected."
                })
        }
        next();
    } catch (err) {
        throw500(err, "Arject Protection Error", res);
        next();
    }
}