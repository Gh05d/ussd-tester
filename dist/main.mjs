function searchCode() {
    try {
        const parser = new UAParser();
        console.log(parser.getResult().device.vendor);
        switch (parser.getResult().device.vendor) {
            case "Apple":
                return "3001#12345#";
            case "Samsung":
            case "OnePlus":
            case "Huawei":
                return "*#*#4636#*#*";
            case "Xiaomi":
                return "*#*#6484#*#";
            case "Vivo":
                return " *##4838##*";
            case "HTC":
                return "*#*#1111#*#*";
            case "Google":
            default:
                return "*#*#4636#*#*";
        }
    }
    catch (error) {
        console.error(error);
        if (navigator?.userAgentData?.platform) {
            return navigator.userAgentData.platform;
        }
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
            return "3001#12345#";
        }
        return "*#*#4636#*#*";
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
document.addEventListener("DOMContentLoaded", () => {
    try {
        const ussdCode = searchCode();
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
