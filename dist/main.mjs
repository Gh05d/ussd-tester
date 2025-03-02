async function searchCode() {
    const appleCode = "3001#12345#";
    const androidCode = "*#*#4636#*#*";
    try {
        const { default: UAParser } = await import("../dist/ua-parser.min.mjs");
        const parser = new UAParser();
        if (parser.getResult().os.name == "Apple")
            return appleCode;
        switch (parser.getResult().device.vendor) {
            case "Apple":
                return appleCode;
            case "LG":
                return "*#*#197328640#*#*";
            case "Sony":
                return "*#*#7378423#*#*";
            case "Xiaomi":
                return "*#*#6484#*#";
            case "Vivo":
                return "*##4838##*";
            case "HTC":
                return "*#*#1111#*#*";
            case "Google":
                return "works";
            case "Samsung":
            case "OnePlus":
            case "Motorola":
            case "Huawei":
            default:
                return "badd";
        }
    }
    catch (error) {
        console.error(error);
        toggleToast(error?.message);
        if (navigator?.userAgentData?.platform) {
            return navigator.userAgentData.platform == "Android"
                ? androidCode
                : appleCode;
        }
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
            return appleCode;
        }
        return androidCode;
    }
}
function encodeUSSD(ussd) {
    return ussd.replace(/\*/g, "%2A").replace(/#/g, "%23");
}
function updateFallback(code) {
    const codeEl = document.querySelector("pre");
    codeEl.textContent = code;
    codeEl.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(code);
            toggleToast("USSD-Code kopiert!");
        }
        catch (err) {
            console.error(err);
        }
    });
}
function toggleToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.addEventListener("animationend", () => {
        document.body.removeChild(toast);
    });
}
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const ussdCode = await searchCode();
        const btn = document.getElementById("copy-code-button");
        btn.textContent = ussdCode;
        btn.addEventListener("click", () => {
            try {
                window.location.href = "tel:" + encodeUSSD(ussdCode);
            }
            catch (err) {
                toggleToast("Fehler beim Ausführen des USSD-Codes.");
            }
        });
        updateFallback(ussdCode);
    }
    catch (error) {
        console.error(error);
    }
});
export {};
