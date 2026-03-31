import React, { useEffect, useMemo, useRef, useState } from "react";
import { fieldLegend } from "../lib/fieldColors";
import {
  Bot,
  MapPin,
  Image as ImageIcon,
  Mic,
  MicOff,
  Send,
  Leaf,
  ShieldCheck,
  Activity,
  LoaderCircle,
  RefreshCw,
  TriangleAlert,
  LocateFixed,
  Sparkles,
  CheckCircle2,
  Upload,
  Languages,
  Volume2,
  Pause,
  Play,
  Square,
  Trash2,
  MessageSquare,
} from "lucide-react";

const API_BASE = "https://farmora-backend-5du1.onrender.com";
const STORAGE_KEY = "farmora_ai_chat_history_v2";

const theme = {
  green: "#6f9b86",
  greenDark: "#3f6f5b",
  greenSoft: "#eef7f2",
  border: "#d7e8de",
  text: "#1f2937",
  muted: "#64748b",
  bg: "#f8fbf9",
  white: "#ffffff",
  warn: "#334155",
  red: "#dc2626",
  userBubble: "#3f6f5b",
  userBubbleText: "#ffffff",
  assistantBubble: "#ffffff",
};

const languages = [
  { code: "en", label: "English", speech: "en-ZA" },
  { code: "zu", label: "isiZulu", speech: "zu-ZA" },
  { code: "xh", label: "isiXhosa", speech: "xh-ZA" },
  { code: "af", label: "Afrikaans", speech: "af-ZA" },
  { code: "st", label: "Sesotho", speech: "st-ZA" },
];

const uiText = {
  en: {
    subtitle: "Where nature meets intelligent technology",
    cropAnalysis: "Crop analysis",
    locationAware: "Location-aware answers",
    multilingual: "Multilingual",
    back: "Back",
    newChat: "New chat",
    clearDraft: "Clear draft",
    askFarmora: "Ask Farmora",
    language: "Language",
    farmingQuestion: "Farming question",
    farmingPlaceholder:
      "Ask about your crop, soil, irrigation, disease symptoms, pest control, or upload an image for analysis.",
    cropImage: "Crop image",
    uploadImage: "Upload image",
    noImage: "No image selected",
    audio: "Audio",
    recordAudio: "Record audio",
    stopRecording: "Stop recording",
    noAudio: "No audio recorded",
    audioOptional:
      "Audio is optional. You can ask with text only, audio only, image only, or combine them.",
    recordedText: "Recorded text",
    liveLocation: "Live location",
    refreshLocation: "Refresh location",
    locationWaiting: "Location not loaded yet",
    send: "Send to Farmora AI",
    sending: "Analyzing with Farmora AI...",
    responseStatus: "Response status",
    whatFarmoraReturns: "What Farmora returns",
    whatFarmoraReturnsText:
      "Crop identification, health status, what is wrong with the plant, how to solve it, and how to prevent it in future. General farming questions also work without an image.",
    fullAnalysis: "Full Farmora analysis",
    waiting:
      "Waiting for your question. You can type, record audio, upload an image, or combine them.",
    requestCompleted: "Request completed",
    audioDetected: "Audio detected",
    noAudioDetected: "No audio detected",
    transcriptSent: "Transcript sent",
    playAudio: "Play audio",
    pauseAudio: "Pause",
    resumeAudio: "Resume",
    stopAudio: "Stop",
    audioFrom: "Start from",
    crop: "Crop",
    healthStatus: "Health status",
    confidence: "Confidence",
    problem: "Problem",
    treatment: "Treatment",
    prevention: "Prevention",
    fullChat: "Conversation",
    locationError: "Location could not be loaded. You can still continue.",
    browserNoGeo: "Geolocation is not supported in this browser.",
    browserNoSpeech: "Speech recognition is not supported in this browser.",
    micError: "Microphone access failed.",
    needInput: "Add a question, record audio, or upload a crop image.",
    apiError: "Farmora AI request failed.",
    currentDraft: "Current draft",
    imageAttached: "Image attached",
    draftTranscript: "Draft transcript",
    restartAudio: "Restart",
  },
  zu: {
    subtitle: "Lapho imvelo ihlangana nobuchwepheshe obuhlakaniphile",
    cropAnalysis: "Ukuhlaziya isitshalo",
    locationAware: "Izimpendulo ezibheka indawo",
    multilingual: "Izilimi eziningi",
    back: "Buyela emuva",
    newChat: "Ingxoxo entsha",
    clearDraft: "Sula umbhalo",
    askFarmora: "Buza kuFarmora",
    language: "Ulimi",
    farmingQuestion: "Umbuzo wezolimo",
    farmingPlaceholder:
      "Buza ngesitshalo sakho, umhlabathi, ukunisela, izimpawu zesifo, izinambuzane noma layisha isithombe ukuze sihlaziywe.",
    cropImage: "Isithombe sesitshalo",
    uploadImage: "Layisha isithombe",
    noImage: "Akukho sithombe esikhethiwe",
    audio: "Umsindo",
    recordAudio: "Qopha umsindo",
    stopRecording: "Misa ukuqopha",
    noAudio: "Akukho msindo oqoshiwe",
    audioOptional:
      "Umsindo uyazikhethela. Ungabuza ngombhalo kuphela, ngomsindo kuphela, ngesithombe kuphela noma ukuhlanganisa konke.",
    recordedText: "Umbhalo oqoshiwe",
    liveLocation: "Indawo bukhoma",
    refreshLocation: "Vuselela indawo",
    locationWaiting: "Indawo ayikalayishwa okwamanje",
    send: "Thumela kuFarmora AI",
    sending: "Farmora AI iyahlaziya...",
    responseStatus: "Isimo sempendulo",
    whatFarmoraReturns: "Okubuyiswa yiFarmora",
    whatFarmoraReturnsText:
      "Ukuhlonza isitshalo, isimo sempilo, inkinga yesitshalo, indlela yokusixazulula, nendlela yokuvikela esikhathini esizayo. Nemibuzo ejwayelekile yezolimo iyasebenza ngaphandle kwesithombe.",
    fullAnalysis: "Ukuhlaziywa okuphelele kweFarmora",
    waiting:
      "Kulindwe umbuzo wakho. Ungabhala, uqophe umsindo, ulayishe isithombe noma ukuhlanganise konke.",
    requestCompleted: "Isicelo siqediwe",
    audioDetected: "Umsindo utholiwe",
    noAudioDetected: "Akukho msindo otholiwe",
    transcriptSent: "Umbhalo othunyelwe",
    playAudio: "Dlala umsindo",
    pauseAudio: "Misa kancane",
    resumeAudio: "Qhubeka",
    stopAudio: "Misa",
    audioFrom: "Qala kusuka ku",
    crop: "Isitshalo",
    healthStatus: "Isimo sempilo",
    confidence: "Ukuqiniseka",
    problem: "Inkinga",
    treatment: "Isixazululo",
    prevention: "Ukuvimbela",
    fullChat: "Ingxoxo",
    locationError: "Indawo ayitholakalanga. Ungaqhubeka noma kunjalo.",
    browserNoGeo: "Lesi siphequluli asisekeli indawo.",
    browserNoSpeech: "Lesi siphequluli asisekeli ukubona izwi.",
    micError: "Ukufinyelela imakrofoni kwehlulekile.",
    needInput: "Faka umbuzo, qopha umsindo, noma layisha isithombe sesitshalo.",
    apiError: "Isicelo seFarmora AI sehlulekile.",
    currentDraft: "Umbhalo wamanje",
    imageAttached: "Isithombe sinamathiselwe",
    draftTranscript: "Umbhalo wokuqopha",
    restartAudio: "Qala futhi",
  },
  af: {
    subtitle: "Waar natuur intelligente tegnologie ontmoet",
    cropAnalysis: "Gewasontleding",
    locationAware: "Liggingbewuste antwoorde",
    multilingual: "Meertalig",
    back: "Terug",
    newChat: "Nuwe gesprek",
    clearDraft: "Maak konsep skoon",
    askFarmora: "Vra Farmora",
    language: "Taal",
    farmingQuestion: "Boerderyvraag",
    farmingPlaceholder:
      "Vra oor jou gewas, grond, besproeiing, siektetekens, plaagbeheer of laai 'n beeld op vir ontleding.",
    cropImage: "Gewasbeeld",
    uploadImage: "Laai beeld op",
    noImage: "Geen beeld gekies nie",
    audio: "Klank",
    recordAudio: "Neem klank op",
    stopRecording: "Stop opname",
    noAudio: "Geen klank opgeneem nie",
    audioOptional:
      "Klank is opsioneel. Jy kan net met teks, net met klank, net met 'n beeld of 'n kombinasie werk.",
    recordedText: "Opgeneemde teks",
    liveLocation: "Lewende ligging",
    refreshLocation: "Verfris ligging",
    locationWaiting: "Ligging nog nie gelaai nie",
    send: "Stuur na Farmora AI",
    sending: "Farmora AI ontleed...",
    responseStatus: "Antwoordstatus",
    whatFarmoraReturns: "Wat Farmora teruggee",
    whatFarmoraReturnsText:
      "Gewasidentifikasie, gesondheidstatus, wat fout is met die plant, hoe om dit op te los, en hoe om dit in die toekoms te voorkom. Algemene boerderyvrae werk ook sonder 'n beeld.",
    fullAnalysis: "Volledige Farmora-ontleding",
    waiting:
      "Wag vir jou vraag. Jy kan tik, klank opneem, 'n beeld oplaai, of alles kombineer.",
    requestCompleted: "Versoek voltooi",
    audioDetected: "Klank opgespoor",
    noAudioDetected: "Geen klank opgespoor nie",
    transcriptSent: "Transkripsie gestuur",
    playAudio: "Speel klank",
    pauseAudio: "Pouseer",
    resumeAudio: "Hervat",
    stopAudio: "Stop",
    audioFrom: "Begin vanaf",
    crop: "Gewas",
    healthStatus: "Gesondheidstatus",
    confidence: "Vertroue",
    problem: "Probleem",
    treatment: "Behandeling",
    prevention: "Voorkoming",
    fullChat: "Gesprek",
    locationError: "Ligging kon nie gelaai word nie. Jy kan steeds voortgaan.",
    browserNoGeo: "Geoligging word nie in hierdie blaaier ondersteun nie.",
    browserNoSpeech: "Spraakherkenning word nie in hierdie blaaier ondersteun nie.",
    micError: "Mikrofoontoegang het misluk.",
    needInput: "Voeg 'n vraag by, neem klank op, of laai 'n gewasbeeld op.",
    apiError: "Farmora AI-versoek het misluk.",
    currentDraft: "Huidige konsep",
    imageAttached: "Beeld aangeheg",
    draftTranscript: "Konseptranskripsie",
    restartAudio: "Begin weer",
  },
};

function getUi(code) {
  return uiText[code] || uiText.en;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function parseSections(text) {
  const clean = String(text || "").replace(/\*\*/g, "").replace(/\*/g, "").trim();
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  const getLineValue = (patterns) => {
    const line = lines.find((l) =>
      patterns.some((p) => l.toLowerCase().startsWith(p))
    );
    if (!line) return "";
    return line.split(":").slice(1).join(":").trim();
  };

  const collectAfter = (patterns) => {
    const startIndex = lines.findIndex((line) =>
      patterns.some((p) => line.toLowerCase().startsWith(p))
    );
    if (startIndex === -1) return "";

    const collected = [];
    for (let i = startIndex + 1; i < lines.length; i += 1) {
      const lower = lines[i].toLowerCase();
      if (
        /^(crop|plant name|confidence|health status|health|problem|treatment|solution|prevention|answer|practical steps|best practice):/.test(
          lower
        ) &&
        collected.length > 0
      ) {
        break;
      }
      collected.push(lines[i].replace(/^[-]\s*/, ""));
    }
    return collected.join(" ");
  };

  return {
    crop:
      getLineValue(["crop:", "plant name:"]) || "Crop not clearly identified",
    health:
      getLineValue(["health status:", "health:"]) ||
      "Assessment available in full response",
    confidence: getLineValue(["confidence:"]),
    problem: collectAfter(["problem:"]),
    treatment: collectAfter(["treatment:", "solution:"]),
    prevention: collectAfter(["prevention:"]),
  };
}

function renderInlineBold(text) {
  const parts = String(text || "").split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderFormattedText(text, role = "assistant") {
  const normalized = String(text || "")
    .replace(/\r/g, "")
    .replace(/\*\*/g, "__BOLD__")
    .replace(/\*/g, "")
    .replace(/__BOLD__/g, "**");

  const lines = normalized.split("\n").filter((line) => line.trim() !== "");

  return lines.map((line, index) => {
    const trimmed = line.trim();
    const headingMatch = trimmed.match(
      /^(Crop|Plant Name|Confidence|Health Status|Health|Problem|Treatment|Solution|Prevention|Answer|Practical Steps|Best Practice)\s*:\s*(.*)$/i
    );

    if (headingMatch) {
      return (
        <div key={index} style={{ marginBottom: 10, lineHeight: 1.6 }}>
          <strong>{headingMatch[1]}:</strong>{" "}
          <span>{renderInlineBold(headingMatch[2])}</span>
        </div>
      );
    }

    return (
      <div key={index} style={{ marginBottom: 10, lineHeight: 1.6 }}>
        {renderInlineBold(trimmed)}
      </div>
    );
  });
}

function Pill({ icon, children, tone = "green" }) {
  const styles =
    tone === "warn"
      ? { background: "#fff7ed", color: theme.warn, border: "#fed7aa" }
      : { background: theme.greenSoft, color: theme.greenDark, border: "#cfe9d7" };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        border: `1px solid ${styles.border}`,
        background: styles.background,
        color: styles.color,
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}

function InfoCard({ title, icon, children }) {
  return (
    <div
      style={{
        background: theme.white,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 10px 30px rgba(13, 61, 31, 0.05)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: theme.greenSoft,
            color: theme.greenDark,
          }}
        >
          {icon}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>{title}</div>
      </div>
      <div style={{ color: theme.muted, lineHeight: 1.6, fontSize: 14 }}>{children}</div>
    </div>
  );
}

function AudioControls({ text, speechLang, includeAudio, labelPlay, labelPause, labelResume, labelStop, labelFrom, labelRestart }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startPercent, setStartPercent] = useState(0);

  const currentUtteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!includeAudio || !text) return null;

  const speakFromPoint = (percent = startPercent) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const content = String(text || "");
    const startIndex = Math.floor((percent / 100) * content.length);
    const sliced = content.slice(startIndex).trim() || content;

    const utterance = new SpeechSynthesisUtterance(sliced);
    utterance.lang = speechLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 14,
        background: "#f3fbf5",
        border: "1px solid #d8ebde",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Volume2 size={16} color={theme.greenDark} />
        <strong style={{ color: theme.greenDark }}>{labelPlay}</strong>
      </div>

      <div style={{ fontSize: 12, color: theme.muted, marginBottom: 8 }}>
        {labelFrom}: {startPercent}%
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={startPercent}
        onChange={(e) => setStartPercent(Number(e.target.value))}
        style={{ width: "100%", marginBottom: 12 }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => speakFromPoint(startPercent)}
          style={audioButtonStyle}
        >
          <Play size={15} />
          {labelPlay}
        </button>

        <button
          type="button"
          onClick={pauseAudio}
          style={audioButtonStyle}
        >
          <Pause size={15} />
          {labelPause}
        </button>

        <button
          type="button"
          onClick={resumeAudio}
          style={audioButtonStyle}
        >
          <Play size={15} />
          {labelResume}
        </button>

        <button
          type="button"
          onClick={() => speakFromPoint(0)}
          style={audioButtonStyle}
        >
          <RefreshCw size={15} />
          {labelRestart}
        </button>

        <button
          type="button"
          onClick={stopAudio}
          style={audioButtonStyle}
        >
          <Square size={15} />
          {labelStop}
        </button>
      </div>
    </div>
  );
}

const audioButtonStyle = {
  border: "none",
  borderRadius: 10,
  padding: "8px 12px",
  background: "#f8fafc",
  color: "#334155",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

function ChatBubble({ item, ui, speechLang }) {
  const parsed = parseSections(item.text);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: item.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          width: "min(100%, 820px)",
          background:
            item.role === "user" ? theme.userBubble : theme.assistantBubble,
          color:
            item.role === "user" ? theme.userBubbleText : theme.text,
          border:
            item.role === "user"
              ? "none"
              : `1px solid ${theme.border}`,
          borderRadius: 22,
          padding: 16,
          boxShadow:
            item.role === "user"
              ? "0 10px 24px rgba(31, 143, 78, 0.18)"
              : "0 10px 30px rgba(13, 61, 31, 0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
            fontWeight: 800,
          }}
        >
          {item.role === "user" ? <MessageSquare size={16} /> : <Bot size={16} />}
          <span>{item.role === "user" ? "You" : "Farmora AI"}</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              opacity: 0.75,
              fontWeight: 600,
            }}
          >
            {item.time}
          </span>
        </div>

        {item.imagePreview && (
          <img
            src={item.imagePreview}
            alt="Uploaded crop"
            style={{
              width: "100%",
              maxHeight: 260,
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: 12,
            }}
          />
        )}

        {item.transcript && item.role === "user" && (
          <div
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 14,
              background:
                item.role === "user"
                  ? "rgba(255,255,255,0.14)"
                  : "#f3fbf5",
              border:
                item.role === "user"
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid #d8ebde",
              fontSize: 14,
            }}
          >
            <strong>{ui.transcriptSent}:</strong> {item.transcript}
          </div>
        )}

        <div style={{ fontSize: 15 }}>{renderFormattedText(item.text, item.role)}</div>

        {item.role === "assistant" && (
          <>
            <div
              style={{
                background: "#fbfefc",
                border: `1px solid ${theme.border}`,
                borderRadius: 18,
                padding: 14,
                marginTop: 14,
                color: theme.text,
              }}
            >
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.crop}</div>
                  <div style={{ color: theme.muted }}>{parsed.crop}</div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.healthStatus}</div>
                  <div style={{ color: theme.muted }}>{parsed.health}</div>
                </div>

                {parsed.confidence && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.confidence}</div>
                    <div style={{ color: theme.muted }}>{parsed.confidence}</div>
                  </div>
                )}

                {parsed.problem && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.problem}</div>
                    <div style={{ color: theme.muted }}>{parsed.problem}</div>
                  </div>
                )}

                {parsed.treatment && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.treatment}</div>
                    <div style={{ color: theme.muted }}>{parsed.treatment}</div>
                  </div>
                )}

                {parsed.prevention && (
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 3 }}>{ui.prevention}</div>
                    <div style={{ color: theme.muted }}>{parsed.prevention}</div>
                  </div>
                )}
              </div>
            </div>

            <AudioControls
              text={item.text}
              speechLang={speechLang}
              includeAudio={item.includeAudio}
              labelPlay={ui.playAudio}
              labelPause={ui.pauseAudio}
              labelResume={ui.resumeAudio}
              labelStop={ui.stopAudio}
              labelFrom={ui.audioFrom}
              labelRestart={ui.restartAudio}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default function FarmoraAIPage({ onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [message, setMessage] = useState("");
  const [includeAudio, setIncludeAudio] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [location, setLocation] = useState(null);
  const [locationLabel, setLocationLabel] = useState(getUi("en").locationWaiting);
  const [audioBase64, setAudioBase64] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioState, setAudioState] = useState(getUi("en").noAudio);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  const ui = useMemo(() => getUi(selectedLanguage), [selectedLanguage]);
  const activeLanguage =
    languages.find((l) => l.code === selectedLanguage) || languages[0];

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch {
        setChatHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chatHistory));
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    setLocationLabel(ui.locationWaiting);
    setAudioState(ui.noAudio);
  }, [selectedLanguage]);

  const getLocation = async () => {
    setError("");

    if (!navigator.geolocation) {
      setLocationLabel(ui.browserNoGeo);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          town: "",
          province: "",
          country: "",
        };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.latitude}&lon=${loc.longitude}`
          );
          const data = await res.json();
          const address = data.address || {};
          loc.town =
            address.city ||
            address.town ||
            address.village ||
            address.hamlet ||
            "";
          loc.province = address.state || "";
          loc.country = address.country || "";
          setLocationLabel(
            [loc.town, loc.province, loc.country].filter(Boolean).join(", ") ||
              `${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`
          );
        } catch {
          setLocationLabel(`${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}`);
        }

        setLocation(loc);
      },
      () => {
        setLocationLabel(ui.locationError);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  };

  const startRecording = async () => {
    setError("");

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError(ui.browserNoSpeech);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const base64 = await blobToBase64(blob);
        setAudioBase64(base64);
        stream.getTracks().forEach((track) => track.stop());
      };

      const recognition = new SpeechRecognition();
      recognition.lang = activeLanguage.speech;
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event) => {
        let finalText = "";
        for (let i = 0; i < event.results.length; i += 1) {
          finalText += event.results[i][0].transcript + " ";
        }
        setTranscript(finalText.trim());
      };

      recognition.onerror = () => {
        setAudioState(ui.noAudio);
      };

      recognitionRef.current = recognition;
      recognition.start();

      mediaRecorderRef.current = recorder;
      recorder.start();

      setRecording(true);
      setAudioState(ui.recordAudio + "...");
    } catch (recordError) {
      setError(recordError.message || ui.micError);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
    setAudioState(ui.audioDetected);
  };

  const clearDraft = () => {
    setMessage("");
    setImageFile(null);
    setImageBase64("");
    setImagePreview("");
    setAudioBase64("");
    setAudioState(ui.noAudio);
    setTranscript("");
    setError("");
  };

  const startNewChat = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEY);
    clearDraft();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!message.trim() && !imageBase64 && !transcript.trim()) {
      setError(ui.needInput);
      return;
    }

    const userText = message.trim() || transcript.trim();

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText || (imageBase64 ? ui.imageAttached : ""),
      transcript: transcript.trim(),
      imagePreview: imagePreview || "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      includeAudio: false,
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          imageBase64: imageBase64 || null,
          audioBase64: audioBase64 || null,
          transcript: transcript || null,
          location,
          language: selectedLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || ui.apiError);
      }

      const assistantMessage = {
        id: data.id || crypto.randomUUID(),
        role: "assistant",
        text: data.response || "",
        transcript: data.transcript || "",
        imagePreview: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        includeAudio,
      };

      setChatHistory((prev) => [...prev, assistantMessage]);
      clearDraft();
    } catch (submitError) {
      setError(submitError.message || ui.apiError);
    } finally {
      setLoading(false);
    }
  };

  const latestAssistant = [...chatHistory].reverse().find((item) => item.role === "assistant");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fdf9 0%, #eef8f1 45%, #f7fcf8 100%)",
        padding: "16px 20px 32px",
      }}
    >
      <div style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div
          style={{
            background: theme.white,
            border: `1px solid ${theme.border}`,
            borderRadius: 20,
            padding: "16px 20px",
            boxShadow: "0 8px 28px rgba(16, 77, 36, 0.06)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    boxShadow: "0 8px 20px rgba(34, 197, 94, 0.2)",
                  }}
                >
                  <Leaf size={22} />
                </div>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: 22,
                      lineHeight: 1.1,
                      color: theme.text,
                      fontWeight: 900,
                    }}
                  >
                    Farmora AI
                  </h1>
                  <div style={{ color: theme.muted, marginTop: 2, fontSize: 12 }}>
                    {ui.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <Pill icon={<ShieldCheck size={14} />}>{ui.cropAnalysis}</Pill>
                <Pill icon={<MapPin size={14} />}>{ui.locationAware}</Pill>
                <Pill icon={<Languages size={14} />}>{ui.multilingual}</Pill>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                {fieldLegend.map((fieldItem) => (
                  <div
                    key={fieldItem.key}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 8px",
                      borderRadius: 999,
                      background: fieldItem.bg,
                      boxShadow: `inset 0 0 0 1px ${fieldItem.border}`,
                      color: fieldItem.color,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: fieldItem.color }} />
                    {fieldItem.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {typeof onBack === "function" && (
                <button onClick={onBack} style={topButtonStyle}>
                  {ui.back}
                </button>
              )}

              <button onClick={startNewChat} style={topButtonStyle}>
                <Trash2 size={16} />
                {ui.newChat}
              </button>

              <button onClick={clearDraft} style={topButtonStyleSoft}>
                <RefreshCw size={16} />
                {ui.clearDraft}
              </button>
            </div>
          </div>
        </div>

        <div
          className="farmora-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr 0.75fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: theme.white,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow: "0 8px 28px rgba(16, 77, 36, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Sparkles size={16} color={theme.greenDark} />
              <div style={{ fontWeight: 800, color: theme.text, fontSize: 16 }}>
                {ui.askFarmora}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{ui.language}</label>
                <div style={{ position: "relative" }}>
                  <Languages
                    size={16}
                    color={theme.greenDark}
                    style={{ position: "absolute", left: 12, top: 11 }}
                  />
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{
                      width: "100%",
                      borderRadius: 14,
                      border: `1px solid ${theme.border}`,
                      padding: "10px 12px 10px 38px",
                      outline: "none",
                      fontSize: 14,
                      color: theme.text,
                      background: "#fbfefc",
                    }}
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>{ui.farmingQuestion}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={ui.farmingPlaceholder}
                  rows={4}
                  style={textareaStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div style={panelStyle}>
                  <div style={panelTitleStyle}>
                    <ImageIcon size={18} color={theme.greenDark} />
                    <span>{ui.cropImage}</span>
                  </div>

                  <label style={uploadButtonStyle}>
                    <Upload size={16} />
                    {ui.uploadImage}
                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                  </label>

                  <div style={{ marginTop: 12, color: theme.muted, fontSize: 13 }}>
                    {imageFile ? imageFile.name : ui.noImage}
                  </div>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Crop preview"
                      style={{
                        width: "100%",
                        marginTop: 14,
                        borderRadius: 16,
                        objectFit: "cover",
                        maxHeight: 220,
                        border: `1px solid ${theme.border}`,
                      }}
                    />
                  )}
                </div>

                <div style={panelStyle}>
                  <div style={panelTitleStyle}>
                    <Mic size={18} color={theme.greenDark} />
                    <span>{ui.audio}</span>
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {!recording ? (
                      <button type="button" onClick={startRecording} style={uploadButtonStyle}>
                        <Mic size={16} />
                        {ui.recordAudio}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        style={{
                          ...uploadButtonStyle,
                          background: "#fff1f2",
                          color: theme.red,
                        }}
                      >
                        <MicOff size={16} />
                        {ui.stopRecording}
                      </button>
                    )}
                  </div>

                  <div style={{ marginTop: 12, fontSize: 13, color: theme.muted }}>
                    {audioState}
                  </div>

                  {transcript && (
                    <div
                      style={{
                        marginTop: 12,
                        padding: 12,
                        borderRadius: 14,
                        background: "#f3fbf5",
                        border: "1px solid #d8ebde",
                        color: "#183024",
                        fontSize: 14,
                      }}
                    >
                      <strong>{ui.recordedText}:</strong> {transcript}
                    </div>
                  )}

                  <div style={{ marginTop: 10, fontSize: 12, color: theme.muted }}>
                    {ui.audioOptional}
                  </div>
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: 20,
                    padding: 16,
                    background: theme.bg,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={panelTitleStyle}>
                        <LocateFixed size={18} color={theme.greenDark} />
                        <span>{ui.liveLocation}</span>
                      </div>
                      <div style={{ color: theme.muted, fontSize: 14 }}>{locationLabel}</div>
                    </div>

                    <button
                      type="button"
                      onClick={getLocation}
                      style={{
                        ...topButtonStyleSoft,
                        padding: "10px 14px",
                      }}
                    >
                      <LocateFixed size={16} />
                      {ui.refreshLocation}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: 20,
                    padding: 16,
                    background: "#fbfefc",
                  }}
                >
                  <div style={{ ...panelTitleStyle, marginBottom: 10 }}>
                    <Volume2 size={18} color={theme.greenDark} />
                    <span>{ui.audio}</span>
                  </div>

                  <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: theme.text }}>
                    <input
                      type="checkbox"
                      checked={includeAudio}
                      onChange={(e) => setIncludeAudio(e.target.checked)}
                    />
                    <span>{ui.playAudio}</span>
                  </label>
                </div>
              </div>

              {error && (
                <div
                  style={{
                    background: "#fff7ed",
                    border: "1px solid #fed7aa",
                    color: theme.warn,
                    padding: 14,
                    borderRadius: 16,
                    marginBottom: 16,
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  <TriangleAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={submitButtonStyle(loading)}>
                {loading ? <LoaderCircle size={18} className="spin" /> : <Send size={18} />}
                {loading ? ui.sending : ui.send}
              </button>
            </form>
          </div>

          <div
            style={{
              background: theme.white,
              border: `1px solid ${theme.border}`,
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow: "0 8px 28px rgba(16, 77, 36, 0.05)",
              minHeight: 500,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <MessageSquare size={16} color={theme.greenDark} />
              <div style={{ fontWeight: 800, color: theme.text, fontSize: 16 }}>
                {ui.fullChat}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                overflowY: "auto",
                paddingRight: 6,
                minHeight: 420,
                maxHeight: 420,
              }}
            >
              {chatHistory.length === 0 ? (
                <div
                  style={{
                    border: `1px dashed ${theme.border}`,
                    borderRadius: 18,
                    padding: 20,
                    background: "#fbfefc",
                    color: theme.muted,
                  }}
                >
                  {ui.waiting}
                </div>
              ) : (
                chatHistory.map((item) => (
                  <ChatBubble
                    key={item.id}
                    item={item}
                    ui={ui}
                    speechLang={activeLanguage.speech}
                  />
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            <InfoCard title={ui.currentDraft} icon={<Activity size={20} />}>
              <div style={{ display: "grid", gap: 12 }}>
                <div>
                  <strong>{ui.language}:</strong> {activeLanguage.label}
                </div>
                <div>
                  <strong>{ui.liveLocation}:</strong> {locationLabel}
                </div>
                <div>
                  <strong>{ui.farmingQuestion}:</strong>{" "}
                  {message || ""}
                </div>
                <div>
                  <strong>{ui.imageAttached}:</strong>{" "}
                  {imageFile ? imageFile.name : ""}
                </div>
                <div>
                  <strong>{ui.draftTranscript}:</strong>{" "}
                  {transcript || ""}
                </div>
              </div>
            </InfoCard>

            <InfoCard title={ui.whatFarmoraReturns} icon={<Bot size={20} />}>
              {ui.whatFarmoraReturnsText}
            </InfoCard>

            <InfoCard title={ui.responseStatus} icon={<CheckCircle2 size={20} />}>
              {latestAssistant ? (
                <div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                    <Pill icon={<CheckCircle2 size={16} />}>{ui.requestCompleted}</Pill>
                    <Pill icon={<MapPin size={16} />}>{locationLabel}</Pill>
                    <Pill icon={<Languages size={16} />}>{activeLanguage.label}</Pill>
                    <Pill
                      icon={audioBase64 ? <Mic size={16} /> : <MicOff size={16} />}
                      tone={audioBase64 ? "green" : "warn"}
                    >
                      {audioBase64 ? ui.audioDetected : ui.noAudioDetected}
                    </Pill>
                  </div>

                  {latestAssistant.transcript && (
                    <div
                      style={{
                        marginBottom: 12,
                        padding: 12,
                        borderRadius: 14,
                        background: "#f3fbf5",
                        border: "1px solid #d8ebde",
                        color: "#183024",
                        fontSize: 14,
                      }}
                    >
                      <strong>{ui.transcriptSent}:</strong> {latestAssistant.transcript}
                    </div>
                  )}

                  <div
                    style={{
                      background: "#fbfefc",
                      border: `1px solid ${theme.border}`,
                      borderRadius: 18,
                      padding: 16,
                    }}
                  >
                    {renderFormattedText(latestAssistant.text)}
                  </div>
                </div>
              ) : (
                ui.waiting
              )}
            </InfoCard>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1180px) {
          .farmora-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: 8,
  color: theme.text,
  fontWeight: 700,
};

const textareaStyle = {
  width: "100%",
  borderRadius: 18,
  border: `1px solid ${theme.border}`,
  padding: 16,
  resize: "vertical",
  outline: "none",
  fontSize: 15,
  color: theme.text,
  background: "#fbfefc",
  boxSizing: "border-box",
};

const panelStyle = {
  border: `1px dashed ${theme.border}`,
  borderRadius: 20,
  padding: 16,
  background: "#fbfefc",
};

const panelTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 8,
  fontWeight: 700,
  color: theme.text,
};

const uploadButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: 14,
  background: theme.greenSoft,
  color: theme.greenDark,
  fontWeight: 700,
  cursor: "pointer",
  border: "none",
};

const topButtonStyle = {
  border: `1px solid ${theme.border}`,
  background: theme.white,
  color: theme.text,
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const topButtonStyleSoft = {
  border: "none",
  background: theme.greenSoft,
  color: theme.greenDark,
  borderRadius: 14,
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const submitButtonStyle = (loading) => ({
  width: "100%",
  border: "none",
  borderRadius: 18,
  padding: "15px 18px",
  background: "linear-gradient(135deg, #475569 0%, #334155 100%)",
  color: "white",
  fontWeight: 800,
  cursor: loading ? "not-allowed" : "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: 15,
  opacity: loading ? 0.75 : 1,
});


