import React, { useState, useMemo, useEffect } from "react";
import {
  Heart,
  Flame,
  Wind,
  Moon,
  Target,
  Zap,
  Feather,
  Star,
  Settings as SettingsIcon,
  LayoutGrid,
  Bell,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Sun,
  ArrowRight,
  Home,
  Share2,
  Grid3x3,
} from "lucide-react";

const CATEGORIES = [
  { id: "kaygi", label: "Kaygı", icon: Wind, color: "#7FA8C9" },
  { id: "motivasyon", label: "Motivasyon", icon: Flame, color: "#FF8B6B" },
  { id: "ozbakim", label: "Öz-bakım", icon: Heart, color: "#E8A0BF" },
  { id: "uyku", label: "Uyku", icon: Moon, color: "#8E7CC3" },
  { id: "odak", label: "Odaklanma", icon: Target, color: "#6FBF9E" },
  { id: "enerji", label: "Enerji", icon: Zap, color: "#F4C463" },
  { id: "huzur", label: "Huzur", icon: Feather, color: "#9BC6C1" },
  { id: "guven", label: "Kendine Güven", icon: Star, color: "#E0955E" },
];

const AFFIRMATIONS = [
  { id: 1, cat: "kaygi", text: "Bu an geçici, ben kalıcıyım." },
  { id: 2, cat: "kaygi", text: "Nefesim sakinleştikçe zihnim de sakinleşiyor." },
  { id: 3, cat: "kaygi", text: "Kontrol edemediğim şeyleri bırakmayı öğreniyorum." },
  { id: 4, cat: "kaygi", text: "Endişem bir ziyaretçi, ev sahibi değil." },
  { id: 5, cat: "kaygi", text: "Şu anda güvendeyim." },
  { id: 6, cat: "motivasyon", text: "Küçük adımlar da ilerlemedir." },
  { id: 7, cat: "motivasyon", text: "Bugün dünkünden bir adım ötedeyim." },
  { id: 8, cat: "motivasyon", text: "Zorluklar beni şekillendiriyor, durdurmuyor." },
  { id: 9, cat: "motivasyon", text: "Başlamak, bitirmenin yarısıdır." },
  { id: 10, cat: "motivasyon", text: "Kendi hızımda ilerlemek yeterli." },
  { id: 11, cat: "ozbakim", text: "Kendime nazik davranmayı hak ediyorum." },
  { id: 12, cat: "ozbakim", text: "Dinlenmek de bir başarıdır." },
  { id: 13, cat: "ozbakim", text: "İhtiyaçlarımı önemsemek bencillik değildir." },
  { id: 14, cat: "ozbakim", text: "Bugün kendime zaman ayırıyorum." },
  { id: 15, cat: "ozbakim", text: "Kendimle konuşma şeklim, bir dostuma konuştuğum kadar nazik olmalı." },
  { id: 16, cat: "uyku", text: "Bugünü bıraktım, yarın yeniden başlayacağım." },
  { id: 17, cat: "uyku", text: "Bedenim dinlenmeyi hak ediyor." },
  { id: 18, cat: "uyku", text: "Zihnim sakinleşiyor, uyku yaklaşıyor." },
  { id: 19, cat: "uyku", text: "Gece bana ait, huzur bana ait." },
  { id: 20, cat: "uyku", text: "Yorgunluğumu kabul ediyor, dinlenmeye izin veriyorum." },
  { id: 21, cat: "odak", text: "Tek seferde tek şey yeter." },
  { id: 22, cat: "odak", text: "Dikkatim şu ana ait." },
  { id: 23, cat: "odak", text: "Dağınıklığı bırakıp önceliğime dönüyorum." },
  { id: 24, cat: "odak", text: "Küçük bir odak, büyük bir fark yaratır." },
  { id: 25, cat: "odak", text: "Şu an yaptığım şey, yapmam gereken şey." },
  { id: 26, cat: "enerji", text: "Bedenimde taze bir güç hissediyorum." },
  { id: 27, cat: "enerji", text: "Enerjim, niyetimle birlikte büyüyor." },
  { id: 28, cat: "enerji", text: "Bugün harekete geçmeye hazırım." },
  { id: 29, cat: "enerji", text: "Küçük bir hareket bile beni canlandırır." },
  { id: 30, cat: "enerji", text: "İçimdeki kıvılcım hâlâ yanıyor." },
  { id: 31, cat: "huzur", text: "Huzur, dışarıda değil içimde." },
  { id: 32, cat: "huzur", text: "Sessizlikte kendimi buluyorum." },
  { id: 33, cat: "huzur", text: "Her nefes beni biraz daha sakinleştiriyor." },
  { id: 34, cat: "huzur", text: "Karmaşanın ortasında bile sakin kalabilirim." },
  { id: 35, cat: "huzur", text: "Bugün huzurumu korumayı seçiyorum." },
  { id: 36, cat: "guven", text: "Yeterince iyiyim, tam da olduğum gibi." },
  { id: 37, cat: "guven", text: "Kendi değerimi başkalarının onayına bağlamıyorum." },
  { id: 38, cat: "guven", text: "Hatalarım beni tanımlamıyor, büyütüyor." },
  { id: 39, cat: "guven", text: "Sesimi duyurmaya hakkım var." },
  { id: 40, cat: "guven", text: "Kendime güvenmeyi her gün yeniden seçiyorum." },
];

const ONBOARD_STEPS = ["welcome", "name", "mood", "notif"];

// --- Supabase bağlantısı ---
// Kendi Supabase projenin URL'ini ve anon (public) API anahtarını buraya yapıştır.
// Supabase Dashboard > Project Settings > API bölümünden alabilirsin.
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-KEY";

const SUPABASE_READY =
  !SUPABASE_URL.includes("YOUR-PROJECT") && !SUPABASE_ANON_KEY.includes("YOUR-ANON-KEY");

async function supa(path, options = {}) {
  if (!SUPABASE_READY) {
    console.warn("Supabase henüz yapılandırılmadı — istek atlandı:", path);
    return null;
  }
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation,resolution=merge-duplicates",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      console.error("Supabase hatası:", res.status, await res.text());
      return null;
    }
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Supabase bağlantı hatası:", e);
    return null;
  }
}

function catInfo(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}

function Glow({ color = "#FF8B6B", size = 260 }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        className="breathe"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}55 0%, ${color}22 40%, transparent 70%)`,
          filter: "blur(6px)",
        }}
      />
    </div>
  );
}

function PhoneChrome({ dark, children }) {
  return (
    <div
      style={{
        width: 380,
        height: 780,
        borderRadius: 44,
        padding: 12,
        background: dark
          ? "linear-gradient(160deg,#1c1730,#120e20)"
          : "linear-gradient(160deg,#2a2440,#1c1730)",
        boxShadow: "0 30px 70px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 34,
          overflow: "hidden",
          position: "relative",
          background: dark ? "#241d3d" : "#FBF6EF",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 120,
            height: 22,
            borderRadius: 14,
            background: "#0a0714",
            zIndex: 50,
          }}
        />
        {children}
      </div>
    </div>
  );
}

function TopBar({ dark, title, onBack, right }) {
  const text = dark ? "#F3ECFF" : "#2A2140";
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: "40px 20px 10px 20px", position: "relative", zIndex: 10 }}
    >
      <div style={{ width: 34 }}>
        {onBack && (
          <button
            onClick={onBack}
            style={{ color: text, background: "transparent", border: "none" }}
          >
            <ChevronLeft size={22} />
          </button>
        )}
      </div>
      <div style={{ color: text, fontWeight: 600, fontSize: 15, letterSpacing: 0.3 }}>
        {title}
      </div>
      <div style={{ width: 34, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

function BottomNav({ dark, tab, setTab, onPremium }) {
  const items = [
    { id: "feed", label: "Bugün", icon: Home },
    { id: "categories", label: "Kategoriler", icon: Grid3x3 },
    { id: "favorites", label: "Favoriler", icon: Heart },
    { id: "settings", label: "Ayarlar", icon: SettingsIcon },
  ];
  const bg = dark ? "rgba(28,23,48,0.9)" : "rgba(251,246,239,0.92)";
  const active = "#FF8B6B";
  const inactive = dark ? "#8B82A8" : "#B3A796";
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: bg,
        backdropFilter: "blur(10px)",
        borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.05)",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 6px 22px 6px",
        zIndex: 40,
      }}
    >
      {items.map((it) => {
        const Icon = it.icon;
        const isActive = tab === it.id;
        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              background: "transparent",
              border: "none",
              color: isActive ? active : inactive,
            }}
          >
            <Icon size={20} fill={isActive && it.id === "favorites" ? active : "none"} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Toast({ text, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: 20,
        right: 20,
        background: "#2A2140",
        color: "#F3ECFF",
        padding: "12px 16px",
        borderRadius: 14,
        fontSize: 13,
        textAlign: "center",
        zIndex: 100,
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}
      className="fadeInUp"
    >
      {text}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [tab, setTab] = useState("feed");
  const [name, setName] = useState("");
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [dark, setDark] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [index, setIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [streak, setStreak] = useState(6);
  const [checkedToday, setCheckedToday] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const [plan, setPlan] = useState("yearly");
  const [toast, setToast] = useState(null);
  const [notifOn, setNotifOn] = useState(true);
  const [premium, setPremium] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showBreath, setShowBreath] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0); // 0 inhale, 1 hold, 2 exhale
  const [paywallStep, setPaywallStep] = useState("commit");
  const [goal, setGoal] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const existing = await window.storage.get("isilti_device_id");
        setDeviceId(existing.value);
      } catch (e) {
        try {
          const id = crypto.randomUUID();
          await window.storage.set("isilti_device_id", id);
          setDeviceId(id);
        } catch (e2) {
          setDeviceId(crypto.randomUUID());
        }
      }
    })();
  }, []);

  const list = useMemo(() => {
    return activeCategory === "all"
      ? AFFIRMATIONS
      : AFFIRMATIONS.filter((a) => a.cat === activeCategory);
  }, [activeCategory]);

  const current = list[index % list.length] || AFFIRMATIONS[0];
  const cat = catInfo(current.cat);

  function next() {
    setIndex((i) => (i + 1) % list.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + list.length) % list.length);
  }
  function toggleFav(id) {
    setFavorites((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      supa(`kullanicilar?on_conflict=device_id`, {
        method: "POST",
        body: JSON.stringify({ device_id: deviceId, favoriler: Array.from(s) }),
      });
      return s;
    });
  }
  function markToday() {
    if (!checkedToday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCheckedToday(true);
      const milestones = { 7: "🏆 7 günlük seriye ulaştın!", 14: "🌟 14 gün kesintisiz devam!", 30: "🎉 30 gün — artık bir alışkanlık oldu!", 100: "💎 100 gün! İnanılmazsın." };
      setToast(milestones[newStreak] || "Bugünü işaretledin ✨ Serin devam ediyor");
      supa(`kullanicilar?on_conflict=device_id`, {
        method: "POST",
        body: JSON.stringify({ device_id: deviceId, seri: newStreak }),
      });
    }
  }
  async function sendFeedback() {
    if (!feedbackText.trim()) return;
    await supa("geri_bildirimler", {
      method: "POST",
      body: JSON.stringify({ device_id: deviceId, mesaj: feedbackText.trim() }),
    });
    setFeedbackText("");
    setShowFeedback(false);
    fireToast(
      SUPABASE_READY
        ? "Geri bildirimin için teşekkürler 🙏"
        : "Demo modu: Supabase henüz bağlanmadı, mesaj gönderilmedi"
    );
  }
  function fireToast(t) {
    setToast(t);
  }
  function goApp() {
    setScreen("app");
    supa(`kullanicilar?on_conflict=device_id`, {
      method: "POST",
      body: JSON.stringify({
        device_id: deviceId,
        isim: name || null,
        secili_kategoriler: selectedMoods,
        bildirim_izni: notifOn,
        seri: streak,
        favoriler: [],
      }),
    });
  }

  const stepIdx = ONBOARD_STEPS.indexOf(screen);
  const progress = stepIdx >= 0 ? (stepIdx + 1) / ONBOARD_STEPS.length : 1;

  useEffect(() => {
    if (!showBreath) return;
    setBreathPhase(0);
    const interval = setInterval(() => {
      setBreathPhase((p) => (p + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [showBreath]);

  const bgMain = dark ? "#241d3d" : "#FBF6EF";
  const textMain = dark ? "#F3ECFF" : "#2A2140";
  const subMain = dark ? "#B4A9D6" : "#8A7F6D";
  const cardBg = dark ? "#2E2650" : "#FFFFFF";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 600px at 50% -10%, #392f5c 0%, #17111f 60%, #100c18 100%)",
        fontFamily:
          "'Georgia', 'Iowan Old Style', ui-serif, serif",
        padding: 24,
      }}
    >
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(0.92); opacity: 0.75; }
          50% { transform: scale(1.06); opacity: 1; }
        }
        .breathe { animation: breathe 5s ease-in-out infinite; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fadeInUp { animation: fadeInUp 0.25s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fadeIn { animation: fadeIn 0.35s ease-out; }
        .isilti-scroll::-webkit-scrollbar { display: none; }
        .isilti-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .sans { font-family: 'Helvetica Neue', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <PhoneChrome dark={dark}>
        {/* ONBOARDING */}
        {screen !== "app" && (
          <div
            className="fadeIn"
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: `linear-gradient(180deg, ${dark ? "#2c2450" : "#F3E6DA"} 0%, ${bgMain} 55%)`,
            }}
          >
            <div style={{ padding: "40px 24px 0 24px" }}>
              <div
                style={{
                  height: 4,
                  borderRadius: 4,
                  background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${progress * 100}%`,
                    background: "linear-gradient(90deg,#FF8B6B,#F4C463)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <div
              className="isilti-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px 28px 28px 28px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {screen === "welcome" && (
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    position: "relative",
                  }}
                >
                  <Glow color="#FF8B6B" size={220} />
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div
                      style={{
                        width: 74,
                        height: 74,
                        borderRadius: "50%",
                        margin: "0 auto 22px auto",
                        background: "linear-gradient(135deg,#FF8B6B,#F4C463)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 10px 30px -6px #FF8B6B99",
                      }}
                    >
                      <Sparkles size={32} color="#241d3d" />
                    </div>
                    <h1 style={{ color: textMain, fontSize: 26, margin: "0 0 10px 0" }}>
                      Işıltı'ya hoş geldin
                    </h1>
                    <p className="sans" style={{ color: subMain, fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>
                      Telefonunu her gün küçük bir iyilik anına dönüştür. Kilit ekranında,
                      widget'ında, ihtiyacın olduğu her anda yanında.
                    </p>
                  </div>
                </div>
              )}

              {screen === "name" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h2 style={{ color: textMain, fontSize: 22, marginBottom: 8 }}>Sana nasıl seslenelim?</h2>
                  <p className="sans" style={{ color: subMain, fontSize: 13, marginBottom: 24 }}>
                    İsmini olumlamalarını kişiselleştirmek için kullanacağız.
                  </p>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Adın"
                    className="sans"
                    style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      color: textMain,
                      fontSize: 15,
                      outline: "none",
                    }}
                  />
                </div>
              )}

              {screen === "mood" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <h2 style={{ color: textMain, fontSize: 22, marginBottom: 8 }}>
                    Şu sıralar neyle uğraşıyorsun?
                  </h2>
                  <p className="sans" style={{ color: subMain, fontSize: 13, marginBottom: 20 }}>
                    Birden fazla seçebilirsin, sana özel bir akış hazırlayalım.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      const sel = selectedMoods.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          onClick={() =>
                            setSelectedMoods((prev) =>
                              sel ? prev.filter((x) => x !== c.id) : [...prev, c.id]
                            )
                          }
                          className="sans"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "12px 10px",
                            borderRadius: 14,
                            border: sel ? `1.5px solid ${c.color}` : `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                            background: sel ? `${c.color}22` : dark ? "rgba(255,255,255,0.04)" : "#fff",
                            color: textMain,
                            fontSize: 13,
                            textAlign: "left",
                          }}
                        >
                          <Icon size={16} color={c.color} />
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {screen === "notif" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 20,
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Bell size={28} color="#F4C463" />
                  </div>
                  <h2 style={{ color: textMain, fontSize: 21, marginBottom: 10 }}>
                    Günün doğru anında hatırlat
                  </h2>
                  <p className="sans" style={{ color: subMain, fontSize: 13, lineHeight: 1.6, maxWidth: 250 }}>
                    Bildirimler, Işıltı'nın kalbidir — güne olumlamayla başlamanı ve gün
                    içinde nefes almanı hatırlatır. İstediğin zaman kapatabilirsin.
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: "0 24px 28px 24px" }}>
              <button
                onClick={() => {
                  if (screen === "notif") {
                    setNotifOn(true);
                    goApp();
                  } else {
                    setScreen(ONBOARD_STEPS[stepIdx + 1]);
                  }
                }}
                className="sans"
                style={{
                  width: "100%",
                  padding: "15px 0",
                  borderRadius: 16,
                  border: "none",
                  background: "linear-gradient(90deg,#FF8B6B,#F4C463)",
                  color: "#241d3d",
                  fontWeight: 700,
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {screen === "welcome" && "Başlayalım"}
                {screen === "name" && "Devam et"}
                {screen === "mood" && "Devam et"}
                {screen === "notif" && "Bildirimlere izin ver"}
                <ArrowRight size={16} />
              </button>
              {screen === "notif" && (
                <button
                  onClick={goApp}
                  className="sans"
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: "10px 0",
                    background: "transparent",
                    border: "none",
                    color: subMain,
                    fontSize: 13,
                  }}
                >
                  Şimdi değil
                </button>
              )}
            </div>
          </div>
        )}

        {/* MAIN APP */}
        {screen === "app" && (
          <div style={{ height: "100%", position: "relative", background: bgMain }}>
            {tab === "feed" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TopBar
                  dark={dark}
                  title={`Merhaba${name ? ", " + name : ""}`}
                  right={
                    <div
                      className="sans"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        color: "#F4C463",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      <Flame size={16} color="#F4C463" fill="#F4C463" />
                      {streak}
                    </div>
                  }
                />
                {selectedMoods.length > 0 && (
                  <div
                    className="isilti-scroll"
                    style={{
                      display: "flex",
                      gap: 8,
                      padding: "0 20px 6px 20px",
                      overflowX: "auto",
                    }}
                  >
                    <span
                      className="sans"
                      style={{
                        color: subMain,
                        fontSize: 11,
                        alignSelf: "center",
                        whiteSpace: "nowrap",
                        marginRight: 2,
                      }}
                    >
                      Senin için:
                    </span>
                    {selectedMoods.map((mid) => {
                      const c = catInfo(mid);
                      const isActive = activeCategory === mid;
                      return (
                        <button
                          key={mid}
                          onClick={() => {
                            setActiveCategory(mid);
                            setIndex(0);
                          }}
                          className="sans"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "6px 12px",
                            borderRadius: 20,
                            border: isActive ? `1.5px solid ${c.color}` : "1px solid transparent",
                            background: isActive ? `${c.color}25` : dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                            color: isActive ? c.color : subMain,
                            fontSize: 11,
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                          }}
                        >
                          <c.icon size={11} />
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                )}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    margin: "6px 20px 20px 20px",
                    borderRadius: 26,
                    background: `linear-gradient(160deg, ${cat.color}33, ${cardBg})`,
                    border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Glow color={cat.color} size={240} />
                  <div
                    style={{
                      padding: "16px 20px 0 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <div
                      className="sans"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        color: cat.color,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      <cat.icon size={14} />
                      {cat.label}
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <button
                        onClick={() => setShowBreath(true)}
                        style={{ background: "transparent", border: "none" }}
                        title="Nefes modu"
                      >
                        <Wind size={19} color={subMain} />
                      </button>
                      <button
                        onClick={() => toggleFav(current.id)}
                        style={{ background: "transparent", border: "none" }}
                      >
                        <Heart
                          size={20}
                          color={favorites.has(current.id) ? "#FF8B6B" : subMain}
                          fill={favorites.has(current.id) ? "#FF8B6B" : "none"}
                        />
                      </button>
                    </div>
                  </div>

                  <div
                    onPointerDown={(e) => {
                      setDragging(true);
                      e.currentTarget.setPointerCapture(e.pointerId);
                      e.currentTarget.dataset.startX = e.clientX;
                    }}
                    onPointerMove={(e) => {
                      if (!dragging) return;
                      const startX = Number(e.currentTarget.dataset.startX || 0);
                      setDragX(e.clientX - startX);
                    }}
                    onPointerUp={() => {
                      setDragging(false);
                      if (dragX > 60) prev();
                      else if (dragX < -60) next();
                      setDragX(0);
                    }}
                    onPointerLeave={() => {
                      if (dragging) {
                        setDragging(false);
                        setDragX(0);
                      }
                    }}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 30px",
                      position: "relative",
                      zIndex: 2,
                      transform: `translateX(${dragX}px) rotate(${dragX / 50}deg)`,
                      transition: dragging ? "none" : "transform 0.25s ease",
                      touchAction: "pan-y",
                      cursor: dragging ? "grabbing" : "grab",
                    }}
                  >
                    <p
                      key={current.id}
                      className="fadeIn"
                      style={{
                        color: textMain,
                        fontSize: 24,
                        lineHeight: 1.5,
                        textAlign: "center",
                        margin: 0,
                      }}
                    >
                      {current.text}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "0 20px 20px 20px",
                      display: "flex",
                      gap: 10,
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <button
                      onClick={prev}
                      style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: 14,
                        border: "none",
                        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                        color: textMain,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => fireToast("Görsel olarak dışa aktarıldı 📤")}
                      className="sans"
                      style={{
                        flex: 2,
                        padding: "12px 0",
                        borderRadius: 14,
                        border: "none",
                        background: "transparent",
                        color: subMain,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Share2 size={15} />
                      Paylaş
                    </button>
                    <button
                      onClick={next}
                      style={{
                        flex: 1,
                        padding: "12px 0",
                        borderRadius: 14,
                        border: "none",
                        background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                        color: textMain,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div style={{ padding: "0 20px 12px 20px" }}>
                  <button
                    onClick={markToday}
                    className="sans"
                    style={{
                      width: "100%",
                      padding: "13px 0",
                      borderRadius: 16,
                      border: "none",
                      background: checkedToday
                        ? dark
                          ? "rgba(111,191,158,0.18)"
                          : "rgba(111,191,158,0.15)"
                        : "linear-gradient(90deg,#FF8B6B,#F4C463)",
                      color: checkedToday ? "#6FBF9E" : "#241d3d",
                      fontWeight: 700,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    {checkedToday ? (
                      <>
                        <Check size={16} /> Bugün için işaretlendi
                      </>
                    ) : (
                      "Bugünü tamamla"
                    )}
                  </button>
                </div>
                <BottomNav dark={dark} tab={tab} setTab={setTab} />
              </div>
            )}

            {tab === "categories" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TopBar dark={dark} title="Kategoriler" />
                <div
                  className="isilti-scroll"
                  style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px 20px" }}
                >
                  <button
                    onClick={() => {
                      setActiveCategory("all");
                      setIndex(0);
                      setTab("feed");
                    }}
                    className="sans"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: 16,
                      border: "none",
                      marginBottom: 10,
                      background: "linear-gradient(90deg,#FF8B6B33,#F4C46333)",
                      color: textMain,
                      fontSize: 14,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    Tüm olumlamalar (karışık)
                    <ChevronRight size={16} />
                  </button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {CATEGORIES.map((c) => {
                      const Icon = c.icon;
                      const count = AFFIRMATIONS.filter((a) => a.cat === c.id).length;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActiveCategory(c.id);
                            setIndex(0);
                            setTab("feed");
                          }}
                          className="sans"
                          style={{
                            padding: "16px 14px",
                            borderRadius: 16,
                            border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)",
                            background: cardBg,
                            textAlign: "left",
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background: `${c.color}25`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 10,
                            }}
                          >
                            <Icon size={17} color={c.color} />
                          </div>
                          <div style={{ color: textMain, fontSize: 13, fontWeight: 700 }}>{c.label}</div>
                          <div style={{ color: subMain, fontSize: 11, marginTop: 2 }}>{count} olumlama</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <BottomNav dark={dark} tab={tab} setTab={setTab} />
              </div>
            )}

            {tab === "favorites" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TopBar dark={dark} title="Favoriler" />
                <div
                  className="isilti-scroll"
                  style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px 20px" }}
                >
                  {favorites.size === 0 && (
                    <div style={{ textAlign: "center", marginTop: 60 }}>
                      <Heart size={30} color={subMain} style={{ marginBottom: 12 }} />
                      <p className="sans" style={{ color: subMain, fontSize: 13 }}>
                        Henüz favori eklemedin. Kalp ikonuna dokunarak olumlamaları kaydet.
                      </p>
                    </div>
                  )}
                  {AFFIRMATIONS.filter((a) => favorites.has(a.id)).map((a) => {
                    const c = catInfo(a.cat);
                    return (
                      <div
                        key={a.id}
                        style={{
                          padding: "14px 16px",
                          borderRadius: 14,
                          background: cardBg,
                          border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
                          marginBottom: 10,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div>
                          <div
                            className="sans"
                            style={{ fontSize: 10, color: c.color, fontWeight: 700, marginBottom: 4 }}
                          >
                            {c.label.toUpperCase()}
                          </div>
                          <div style={{ color: textMain, fontSize: 14 }}>{a.text}</div>
                        </div>
                        <button onClick={() => toggleFav(a.id)} style={{ background: "transparent", border: "none" }}>
                          <Heart size={18} color="#FF8B6B" fill="#FF8B6B" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                <BottomNav dark={dark} tab={tab} setTab={setTab} />
              </div>
            )}

            {tab === "settings" && (
              <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <TopBar dark={dark} title="Ayarlar" />
                <div
                  className="isilti-scroll"
                  style={{ flex: 1, overflowY: "auto", padding: "8px 20px 100px 20px" }}
                >
                  <div
                    style={{
                      padding: "18px",
                      borderRadius: 18,
                      background: "linear-gradient(120deg,#FF8B6B,#F4C463)",
                      marginBottom: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ color: "#241d3d", fontWeight: 700, fontSize: 14 }}>
                        {name || "Misafir"}
                      </div>
                      <div className="sans" style={{ color: "#3b2f1f", fontSize: 11, marginTop: 2 }}>
                        {streak} günlük seri 🔥
                      </div>
                    </div>
                    <Flame size={26} color="#241d3d" />
                  </div>

                  {!premium && (
                    <button
                      onClick={() => {
                        setPaywallStep("commit");
                        setShowPaywall(true);
                      }}
                      className="sans"
                      style={{
                        width: "100%",
                        padding: "16px",
                        borderRadius: 16,
                        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                        background: cardBg,
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Sparkles size={18} color="#F4C463" />
                        <span style={{ color: textMain, fontSize: 13, fontWeight: 700 }}>
                          Premium'a geç
                        </span>
                      </div>
                      <ChevronRight size={16} color={subMain} />
                    </button>
                  )}

                  <SettingsRow
                    dark={dark}
                    icon={Bell}
                    label="Bildirimler"
                    right={
                      <Toggle value={notifOn} onChange={() => setNotifOn((v) => !v)} />
                    }
                  />
                  <SettingsRow
                    dark={dark}
                    icon={dark ? Moon : Sun}
                    label="Koyu tema"
                    right={<Toggle value={dark} onChange={() => setDark((v) => !v)} />}
                  />
                  <SettingsRow
                    dark={dark}
                    icon={LayoutGrid}
                    label="Widget'ları önizle"
                    right={<ChevronRight size={16} color={subMain} />}
                    onClick={() => setShowWidget(true)}
                  />
                  <SettingsRow
                    dark={dark}
                    icon={Share2}
                    label="Geri bildirim gönder"
                    right={<ChevronRight size={16} color={subMain} />}
                    onClick={() => setShowFeedback(true)}
                  />
                  <div
                    className="sans"
                    style={{
                      marginTop: 10,
                      padding: "10px 12px",
                      borderRadius: 12,
                      fontSize: 11,
                      color: subMain,
                      background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    }}
                  >
                    Supabase durumu:{" "}
                    <strong style={{ color: SUPABASE_READY ? "#6FBF9E" : "#FF8B6B" }}>
                      {SUPABASE_READY ? "Bağlı" : "Yapılandırılmadı"}
                    </strong>
                    {!SUPABASE_READY && " — kod içindeki SUPABASE_URL / SUPABASE_ANON_KEY alanlarını doldur."}
                  </div>
                </div>
                <BottomNav dark={dark} tab={tab} setTab={setTab} />
              </div>
            )}

            {/* PAYWALL OVERLAY */}
            {showPaywall && (
              <div
                className="fadeIn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: dark ? "#1c1730" : "#FBF6EF",
                  zIndex: 60,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ padding: "20px 20px 0 20px", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setShowPaywall(false);
                      setPaywallStep("commit");
                    }}
                    style={{ background: "transparent", border: "none" }}
                  >
                    <X size={22} color={textMain} />
                  </button>
                </div>

                {paywallStep === "commit" && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px 26px 26px 26px" }}>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#FF8B6B,#F4C463)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 18,
                        }}
                      >
                        <Target size={24} color="#241d3d" />
                      </div>
                      <h2 style={{ color: textMain, fontSize: 21, margin: "0 0 8px 0" }}>
                        Önce küçük bir hedef belirleyelim
                      </h2>
                      <p className="sans" style={{ color: subMain, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
                        Bir hedefe bağlı kalmak, alışkanlık oluşturmanın en güçlü yollarından biri.
                        Şu an en çok neyi geliştirmek istersin?
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[
                          { id: "gunluk", label: "Her gün en az bir olumlama okumak" },
                          { id: "kaygi", label: "Kaygımı daha iyi yönetmek" },
                          { id: "ozguven", label: "Kendime olan güvenimi artırmak" },
                        ].map((g) => (
                          <button
                            key={g.id}
                            onClick={() => setGoal(g.id)}
                            className="sans"
                            style={{
                              textAlign: "left",
                              padding: "13px 16px",
                              borderRadius: 14,
                              border: goal === g.id ? "2px solid #FF8B6B" : `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                              background: goal === g.id ? (dark ? "rgba(255,139,107,0.12)" : "#FFF3EE") : "transparent",
                              color: textMain,
                              fontSize: 13,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            {g.label}
                            {goal === g.id && <Check size={15} color="#FF8B6B" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      disabled={!goal}
                      onClick={() => setPaywallStep("plans")}
                      className="sans"
                      style={{
                        width: "100%",
                        padding: "15px 0",
                        borderRadius: 16,
                        border: "none",
                        background: goal ? "linear-gradient(90deg,#FF8B6B,#F4C463)" : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
                        color: goal ? "#241d3d" : subMain,
                        fontWeight: 700,
                        fontSize: 15,
                        marginTop: 20,
                      }}
                    >
                      Bu hedefe bağlı kalmak istiyorum
                    </button>
                  </div>
                )}

                {paywallStep === "plans" && (
                <>
                <div style={{ padding: "0 26px", textAlign: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      margin: "0 auto 16px auto",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#FF8B6B,#F4C463)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={26} color="#241d3d" />
                  </div>
                  <h2 style={{ color: textMain, fontSize: 21, margin: "0 0 6px 0" }}>Işıltı Premium</h2>
                  <p className="sans" style={{ color: subMain, fontSize: 12.5, lineHeight: 1.6 }}>
                    Tüm kategoriler, sınırsız widget teması, özel arka planlar ve reklamsız
                    bir deneyim.
                  </p>
                </div>

                <div
                  className="isilti-scroll"
                  style={{ flex: 1, overflowY: "auto", padding: "18px 22px" }}
                >
                  {[
                    { id: "weekly", label: "Haftalık", price: "₺39,99", sub: "haftada" },
                    { id: "yearly", label: "Yıllık", price: "₺349,99", sub: "yılda · 3 gün ücretsiz deneme", best: true },
                    { id: "monthly", label: "Aylık", price: "₺89,99", sub: "ayda" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className="sans"
                      style={{
                        width: "100%",
                        padding: "14px 16px",
                        borderRadius: 16,
                        marginBottom: 10,
                        border: plan === p.id ? "2px solid #FF8B6B" : `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        background: plan === p.id ? (dark ? "rgba(255,139,107,0.1)" : "#FFF3EE") : cardBg,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      {p.best && (
                        <span
                          style={{
                            position: "absolute",
                            top: -9,
                            left: 14,
                            background: "#F4C463",
                            color: "#241d3d",
                            fontSize: 9,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 8,
                          }}
                        >
                          EN AVANTAJLI
                        </span>
                      )}
                      <div style={{ textAlign: "left" }}>
                        <div style={{ color: textMain, fontSize: 14, fontWeight: 700 }}>{p.label}</div>
                        <div style={{ color: subMain, fontSize: 11 }}>{p.sub}</div>
                      </div>
                      <div style={{ color: textMain, fontSize: 15, fontWeight: 700 }}>{p.price}</div>
                    </button>
                  ))}

                  <div style={{ marginTop: 8 }}>
                    {["Tüm kategoriler ve içerikler", "Sınırsız widget teması", "Özel arka plan yükleme", "Reklamsız deneyim"].map(
                      (f) => (
                        <div key={f} className="sans" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <Check size={14} color="#6FBF9E" />
                          <span style={{ color: textMain, fontSize: 12.5 }}>{f}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div style={{ padding: "0 22px 26px 22px" }}>
                  <button
                    onClick={() => {
                      setPremium(true);
                      setShowPaywall(false);
                      setPaywallStep("commit");
                      fireToast("Bu bir prototip — satın alma simüle edildi 🎉");
                    }}
                    className="sans"
                    style={{
                      width: "100%",
                      padding: "15px 0",
                      borderRadius: 16,
                      border: "none",
                      background: "linear-gradient(90deg,#FF8B6B,#F4C463)",
                      color: "#241d3d",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Ücretsiz denemeyi başlat
                  </button>
                  <p className="sans" style={{ color: subMain, fontSize: 10, textAlign: "center", marginTop: 8 }}>
                    3 gün ücretsiz, sonrasında seçtiğin pakete göre otomatik yenilenir. İstediğin zaman iptal edebilirsin.
                  </p>
                </div>
                </>
                )}
              </div>
            )}

            {/* WIDGET PREVIEW OVERLAY */}
            {showWidget && (
              <div
                className="fadeIn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg,#2c2450,#17111f)",
                  zIndex: 60,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TopBar dark={true} title="Widget Önizleme" onBack={() => setShowWidget(false)} />
                <div style={{ flex: 1, padding: "10px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <div
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 20,
                        background: `linear-gradient(150deg, ${cat.color}55, #2E2650)`,
                        padding: 12,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <cat.icon size={16} color={cat.color} />
                      <span className="sans" style={{ color: "#F3ECFF", fontSize: 10, lineHeight: 1.3 }}>
                        {current.text.slice(0, 40)}…
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 100,
                        borderRadius: 20,
                        background: `linear-gradient(150deg, ${cat.color}55, #2E2650)`,
                        padding: 14,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <cat.icon size={14} color={cat.color} />
                        <span className="sans" style={{ color: cat.color, fontSize: 10, fontWeight: 700 }}>
                          {cat.label.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ color: "#F3ECFF", fontSize: 13, lineHeight: 1.35 }}>{current.text}</span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 140,
                      borderRadius: 22,
                      background: `linear-gradient(160deg, ${cat.color}55, #2E2650)`,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          background: "linear-gradient(135deg,#FF8B6B,#F4C463)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Sparkles size={14} color="#241d3d" />
                      </div>
                      <span className="sans" style={{ color: "#F3ECFF", fontSize: 11, fontWeight: 700 }}>
                        Işıltı
                      </span>
                    </div>
                    <span style={{ color: "#F3ECFF", fontSize: 17, lineHeight: 1.4 }}>{current.text}</span>
                    <span className="sans" style={{ color: "#B4A9D6", fontSize: 10 }}>Bugün · {cat.label}</span>
                  </div>
                  <p className="sans" style={{ color: "#B4A9D6", fontSize: 11.5, textAlign: "center", marginTop: 4 }}>
                    Küçük, orta ve büyük boy widget'ları kilit ekranına veya ana ekranına
                    ekleyip her saat başı yeni bir olumlama görebilirsin.
                  </p>
                </div>
              </div>
            )}

            {/* FEEDBACK OVERLAY */}
            {showFeedback && (
              <div
                className="fadeIn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(10,7,20,0.6)",
                  zIndex: 70,
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    background: dark ? "#241d3d" : "#FBF6EF",
                    borderTopLeftRadius: 26,
                    borderTopRightRadius: 26,
                    padding: "22px 22px 28px 22px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ color: textMain, fontSize: 16, margin: 0 }}>Geri bildirim gönder</h3>
                    <button onClick={() => setShowFeedback(false)} style={{ background: "transparent", border: "none" }}>
                      <X size={20} color={textMain} />
                    </button>
                  </div>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Ne düşünüyorsun? Neyi geliştirebiliriz?"
                    className="sans"
                    rows={4}
                    style={{
                      width: "100%",
                      padding: 14,
                      borderRadius: 14,
                      border: `1px solid ${dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
                      background: dark ? "rgba(255,255,255,0.06)" : "#fff",
                      color: textMain,
                      fontSize: 13,
                      outline: "none",
                      resize: "none",
                      marginBottom: 14,
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    onClick={sendFeedback}
                    className="sans"
                    style={{
                      width: "100%",
                      padding: "14px 0",
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(90deg,#FF8B6B,#F4C463)",
                      color: "#241d3d",
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Gönder
                  </button>
                </div>
              </div>
            )}

            {/* BREATH MODE OVERLAY */}
            {showBreath && (
              <div
                className="fadeIn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 50% 40%, #392f5c 0%, #17111f 70%)",
                  zIndex: 65,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ padding: "20px 20px 0 20px", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowBreath(false)} style={{ background: "transparent", border: "none" }}>
                    <X size={22} color="#F3ECFF" />
                  </button>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div
                    key={breathPhase}
                    style={{
                      width: breathPhase === 2 ? 100 : breathPhase === 1 ? 170 : 170,
                      height: breathPhase === 2 ? 100 : breathPhase === 1 ? 170 : 170,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${cat.color}66 0%, ${cat.color}22 60%, transparent 80%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "width 4s ease-in-out, height 4s ease-in-out",
                    }}
                  >
                    <div
                      style={{
                        width: breathPhase === 2 ? 60 : 110,
                        height: breathPhase === 2 ? 60 : 110,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${cat.color}cc, ${cat.color}55)`,
                        transition: "width 4s ease-in-out, height 4s ease-in-out",
                      }}
                    />
                  </div>
                  <p className="sans" style={{ color: "#F3ECFF", fontSize: 18, fontWeight: 600, marginTop: 30 }}>
                    {breathPhase === 0 ? "Nefes al…" : breathPhase === 1 ? "Tut…" : "Bırak…"}
                  </p>
                  <p className="sans" style={{ color: "#B4A9D6", fontSize: 12, marginTop: 6, textAlign: "center", maxWidth: 220 }}>
                    Daireyle birlikte 4 saniye nefes al, 4 saniye tut, 4 saniye ver. İstediğin kadar tekrarla.
                  </p>
                </div>
              </div>
            )}

            {toast && <Toast text={toast} onDone={() => setToast(null)} />}
          </div>
        )}
      </PhoneChrome>
    </div>
  );
}

function SettingsRow({ dark, icon: Icon, label, right, onClick }) {
  const textMain = dark ? "#F3ECFF" : "#2A2140";
  const cardBg = dark ? "#2E2650" : "#FFFFFF";
  return (
    <button
      onClick={onClick}
      className="sans"
      style={{
        width: "100%",
        padding: "13px 14px",
        borderRadius: 14,
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.05)",
        background: cardBg,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={16} color={textMain} />
        <span style={{ color: textMain, fontSize: 13 }}>{label}</span>
      </div>
      {right}
    </button>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      style={{
        width: 40,
        height: 24,
        borderRadius: 12,
        border: "none",
        background: value ? "#FF8B6B" : "rgba(120,120,140,0.4)",
        position: "relative",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: value ? 19 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "#fff",
          transition: "left 0.2s",
        }}
      />
    </button>
  );
}
