import React, { useState, useRef, useEffect } from "react";
import { Search, UserPlus, PenLine, Trash2, Settings2, X, ChevronRight } from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`;

const TABS = [
    { key: "lookup", label: "Look Up", icon: Search },
    { key: "enroll", label: "Enroll", icon: UserPlus },
    { key: "amend", label: "Amend", icon: PenLine },
    { key: "withdraw", label: "Withdraw", icon: Trash2 },
];

function StampMark({ text, tone, show }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "38%",
                right: "8%",
                transform: show
                    ? "rotate(-11deg) scale(1)"
                    : "rotate(-11deg) scale(1.4)",
                opacity: show ? 0.88 : 0,
                transition: "opacity 420ms ease, transform 420ms ease",
                pointerEvents: "none",
                border: `3px solid ${tone}`,
                color: tone,
                borderRadius: "6px",
                padding: "6px 14px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: "20px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                mixBlendMode: "multiply",
            }}
        >
            {text}
        </div>
    );
}

function RuledCard({ children, holePunch = true }) {
    return (
        <div
            style={{
                position: "relative",
                background:
                    "repeating-linear-gradient(var(--parchment), var(--parchment) 33px, var(--rule) 34px)",
                backgroundColor: "var(--parchment)",
                border: "1px solid var(--ink-20)",
                boxShadow:
                    "0 1px 0 rgba(255,255,255,0.5) inset, 0 18px 34px -18px rgba(20,26,20,0.45)",
                borderRadius: "3px",
                padding: "34px 30px 26px 56px",
                minHeight: "360px",
                overflow: "hidden",
            }}
        >
            {holePunch && (
                <div
                    style={{
                        position: "absolute",
                        left: "26px",
                        top: "0",
                        bottom: "0",
                        width: "1px",
                        background:
                            "repeating-linear-gradient(to bottom, var(--ink-30) 0 8px, transparent 8px 22px)",
                    }}
                />
            )}
            {holePunch &&
                [1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: "18px",
                            top: `${i * 78}px`,
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "var(--drawer)",
                            boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)",
                        }}
                    />
                ))}
            {children}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <label style={{ display: "block", marginBottom: "16px" }}>
      <span
          style={{
              display: "block",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10.5px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "var(--ink-60)",
              marginBottom: "5px",
          }}
      >
        {label}
      </span>
            {children}
        </label>
    );
}

const inputStyle = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1.5px solid var(--ink-30)",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "15px",
    color: "var(--ink)",
    padding: "4px 2px",
    outline: "none",
};

function TextInput(props) {
    return (
        <input
            {...props}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderBottomColor = "var(--brass)")}
            onBlur={(e) => (e.target.style.borderBottomColor = "var(--ink-30)")}
        />
    );
}

function Button({ children, onClick, tone = "brass", disabled, type = "button" }) {
    const bg = tone === "brass" ? "var(--brass)" : tone === "rust" ? "var(--rust)" : "var(--slate)";
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "12.5px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--parchment)",
                background: bg,
                border: "none",
                borderRadius: "2px",
                padding: "11px 20px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.55 : 1,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 0 rgba(0,0,0,0.18)",
                transition: "transform 120ms ease",
            }}
            onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = "translateY(3px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0px)")}
        >
            {children}
        </button>
    );
}

export default function StudentRecordsUI() {
    const [apiBase, setApiBase] = useState("http://localhost:8080");
    const [showSettings, setShowSettings] = useState(false);
    const [tab, setTab] = useState("lookup");
    const [loading, setLoading] = useState(false);
    const [ledger, setLedger] = useState([]);
    const ledgerEndRef = useRef(null);

    const [lookupId, setLookupId] = useState("");
    const [record, setRecord] = useState(null);
    const [lookupStamp, setLookupStamp] = useState(null);

    const [enrollForm, setEnrollForm] = useState({ name: "", age: "", dept: "", password: "" });
    const [enrollStamp, setEnrollStamp] = useState(null);

    const [amendId, setAmendId] = useState("");
    const [amendLoaded, setAmendLoaded] = useState(null);
    const [amendForm, setAmendForm] = useState({ name: "", age: "", dept: "" });
    const [amendStamp, setAmendStamp] = useState(null);

    const [withdrawId, setWithdrawId] = useState("");
    const [withdrawStamp, setWithdrawStamp] = useState(null);

    useEffect(() => {
        if (ledgerEndRef.current) {
            ledgerEndRef.current.scrollTop = ledgerEndRef.current.scrollHeight;
        }
    }, [ledger]);

    function addEntry(action, status, detail) {
        setLedger((prev) => [
            ...prev,
            {
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                action,
                status,
                detail,
            },
        ]);
    }

    async function call(path, options) {
        const res = await fetch(`${apiBase}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        let body = null;
        try {
            body = await res.json();
        } catch (e) {
            body = null;
        }
        return { ok: res.ok, status: res.status, body };
    }

    async function doLookup() {
        if (!lookupId) return;
        setLoading(true);
        setLookupStamp(null);
        setRecord(null);
        try {
            const { ok, status, body } = await call(`/get/${lookupId}`);
            if (ok && body) {
                setRecord(body);
                setLookupStamp({ text: "on file", tone: "var(--slate)" });
                addEntry("look up", "found", `#${lookupId} located`);
            } else {
                setLookupStamp({ text: "not found", tone: "var(--rust)" });
                addEntry("look up", "declined", `#${lookupId} — ${status}`);
            }
        } catch (e) {
            setLookupStamp({ text: "no connection", tone: "var(--rust)" });
            addEntry("look up", "error", e.message);
        }
        setLoading(false);
    }

    async function doEnroll() {
        setLoading(true);
        setEnrollStamp(null);
        try {
            const payload = {
                name: enrollForm.name,
                age: Number(enrollForm.age),
                dept: enrollForm.dept,
                password: enrollForm.password,
            };
            const { ok, status, body } = await call("/create", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            if (ok && body) {
                setEnrollStamp({ text: "enrolled", tone: "var(--slate)" });
                addEntry("enroll", "recorded", `#${body.id} ${payload.name}`);
                setEnrollForm({ name: "", age: "", dept: "", password: "" });
            } else {
                setEnrollStamp({ text: "declined", tone: "var(--rust)" });
                addEntry("enroll", "declined", `${payload.name || "unnamed"} — invalid fields (${status})`);
            }
        } catch (e) {
            setEnrollStamp({ text: "no connection", tone: "var(--rust)" });
            addEntry("enroll", "error", e.message);
        }
        setLoading(false);
    }

    async function loadForAmend() {
        if (!amendId) return;
        setLoading(true);
        setAmendStamp(null);
        setAmendLoaded(null);
        try {
            const { ok, body, status } = await call(`/get/${amendId}`);
            if (ok && body) {
                setAmendLoaded(body);
                setAmendForm({ name: body.name || "", age: body.age ?? "", dept: body.department || "" });
            } else {
                setAmendStamp({ text: "not found", tone: "var(--rust)" });
                addEntry("amend", "declined", `#${amendId} — ${status}`);
            }
        } catch (e) {
            setAmendStamp({ text: "no connection", tone: "var(--rust)" });
            addEntry("amend", "error", e.message);
        }
        setLoading(false);
    }

    async function doAmend() {
        if (!amendLoaded) return;
        setLoading(true);
        setAmendStamp(null);
        try {
            const payload = {
                name: amendForm.name,
                age: Number(amendForm.age),
            };
            const { ok, status } = await call(`/update/${amendId}`, {
                method: "PUT",
                body: JSON.stringify(payload),
            });
            if (ok) {
                setAmendStamp({ text: "amended", tone: "var(--slate)" });
                addEntry("amend", "recorded", `#${amendId} updated`);
            } else {
                setAmendStamp({ text: "declined", tone: "var(--rust)" });
                addEntry("amend", "declined", `#${amendId} — ${status}`);
            }
        } catch (e) {
            setAmendStamp({ text: "no connection", tone: "var(--rust)" });
            addEntry("amend", "error", e.message);
        }
        setLoading(false);
    }

    async function doWithdraw() {
        if (!withdrawId) return;
        setLoading(true);
        setWithdrawStamp(null);
        try {
            const { ok, status } = await call(`/delete/${withdrawId}`, { method: "DELETE" });
            if (ok) {
                setWithdrawStamp({ text: "withdrawn", tone: "var(--rust)" });
                addEntry("withdraw", "removed", `#${withdrawId} removed`);
                setWithdrawId("");
            } else {
                setWithdrawStamp({ text: "not found", tone: "var(--slate)" });
                addEntry("withdraw", "declined", `#${withdrawId} — ${status}`);
            }
        } catch (e) {
            setWithdrawStamp({ text: "no connection", tone: "var(--rust)" });
            addEntry("withdraw", "error", e.message);
        }
        setLoading(false);
    }

    return (
        <div
            style={{
                "--ink": "#1E2A22",
                "--ink-60": "rgba(30,42,34,0.62)",
                "--ink-30": "rgba(30,42,34,0.3)",
                "--ink-20": "rgba(30,42,34,0.16)",
                "--parchment": "#F1EAD3",
                "--rule": "rgba(30,42,34,0.08)",
                "--brass": "#A9762F",
                "--rust": "#8B3A32",
                "--slate": "#3E5C56",
                "--drawer": "#1F3B33",
                fontFamily: "'IBM Plex Mono', monospace",
                background:
                    "radial-gradient(ellipse at top, #2B4A40 0%, #1F3B33 55%, #16281F 100%)",
                minHeight: "100%",
                padding: "36px 20px 50px",
                color: "var(--ink)",
            }}
        >
            <style>{FONTS}</style>

            <div style={{ maxWidth: "760px", margin: "0 auto" }}>
                {/* Header / drawer plate */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        marginBottom: "22px",
                        color: "#F1EAD3",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "11px",
                                letterSpacing: "3px",
                                textTransform: "uppercase",
                                opacity: 0.65,
                                marginBottom: "6px",
                            }}
                        >
                            Registrar&rsquo;s Office &middot; Card Catalog
                        </div>
                        <h1
                            style={{
                                fontFamily: "'Fraunces', serif",
                                fontWeight: 600,
                                fontSize: "34px",
                                margin: 0,
                                letterSpacing: "0.5px",
                            }}
                        >
                            Student Records
                        </h1>
                    </div>
                    <button
                        onClick={() => setShowSettings((s) => !s)}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(241,234,211,0.35)",
                            borderRadius: "3px",
                            color: "#F1EAD3",
                            padding: "9px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: "11px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}
                    >
                        <Settings2 size={14} /> Server
                    </button>
                </div>

                {showSettings && (
                    <div
                        style={{
                            background: "rgba(241,234,211,0.08)",
                            border: "1px solid rgba(241,234,211,0.2)",
                            borderRadius: "4px",
                            padding: "14px 16px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
            <span style={{ color: "#F1EAD3", fontSize: "11px", letterSpacing: "1px", opacity: 0.75, whiteSpace: "nowrap" }}>
              API BASE URL
            </span>
                        <input
                            value={apiBase}
                            onChange={(e) => setApiBase(e.target.value)}
                            placeholder="http://localhost:8080"
                            style={{
                                flex: 1,
                                background: "transparent",
                                border: "none",
                                borderBottom: "1.5px solid rgba(241,234,211,0.4)",
                                color: "#F1EAD3",
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: "13px",
                                padding: "4px 2px",
                                outline: "none",
                            }}
                        />
                        <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", color: "#F1EAD3", cursor: "pointer" }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div style={{ display: "flex", gap: "2px", marginBottom: "0" }}>
                    {TABS.map(({ key, label, icon: Icon }) => {
                        const active = tab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                style={{
                                    flex: 1,
                                    background: active ? "var(--parchment)" : "rgba(241,234,211,0.14)",
                                    color: active ? "var(--ink)" : "#F1EAD3",
                                    border: "none",
                                    borderTopLeftRadius: "6px",
                                    borderTopRightRadius: "6px",
                                    padding: "12px 8px",
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: "11.5px",
                                    letterSpacing: "1.2px",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                    transform: active ? "translateY(0)" : "translateY(4px)",
                                    transition: "transform 160ms ease",
                                }}
                            >
                                <Icon size={14} /> {label}
                            </button>
                        );
                    })}
                </div>

                {/* Card panel */}
                <div style={{ position: "relative" }}>
                    {tab === "lookup" && (
                        <RuledCard>
                            <StampMark text={lookupStamp?.text || ""} tone={lookupStamp?.tone || "var(--slate)"} show={!!lookupStamp} />
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "22px" }}>
                                <div style={{ flex: 1 }}>
                                    <Field label="Student ID">
                                        <TextInput
                                            value={lookupId}
                                            onChange={(e) => setLookupId(e.target.value)}
                                            placeholder="e.g. 1231"
                                            onKeyDown={(e) => e.key === "Enter" && doLookup()}
                                        />
                                    </Field>
                                </div>
                                <Button onClick={doLookup} disabled={loading || !lookupId}>
                                    <Search size={13} /> Find
                                </Button>
                            </div>

                            {record ? (
                                <div>
                                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", marginBottom: "10px" }}>
                                        {record.name}
                                    </div>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13.5px" }}>
                                        <div><span style={{ color: "var(--ink-60)" }}>ID &middot; </span>{record.id}</div>
                                        <div><span style={{ color: "var(--ink-60)" }}>Age &middot; </span>{record.age}</div>
                                        <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "var(--ink-60)" }}>Department &middot; </span>{record.department}</div>
                                    </div>
                                    <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px dashed var(--ink-20)", fontSize: "11px", color: "var(--ink-60)" }}>
                                        {record.createdAt && <div>Filed &middot; {new Date(record.createdAt).toLocaleString()}</div>}
                                        {record.updatedAt && <div>Last amended &middot; {new Date(record.updatedAt).toLocaleString()}</div>}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ color: "var(--ink-60)", fontSize: "13px" }}>
                                    Enter a student ID to pull their card from the drawer.
                                </div>
                            )}
                        </RuledCard>
                    )}

                    {tab === "enroll" && (
                        <RuledCard>
                            <StampMark text={enrollStamp?.text || ""} tone={enrollStamp?.tone || "var(--slate)"} show={!!enrollStamp} />
                            <div style={{ color: "var(--ink-60)", fontSize: "12px", marginBottom: "16px" }}>
                                A student ID is assigned automatically once the card is filed.
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                                <Field label="Full name">
                                    <TextInput value={enrollForm.name} onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })} placeholder="Enter your name" />
                                </Field>
                                <Field label="Age">
                                    <TextInput value={enrollForm.age} onChange={(e) => setEnrollForm({ ...enrollForm, age: e.target.value })} placeholder="Enter your age" />
                                </Field>
                                <Field label="Department">
                                    <TextInput value={enrollForm.dept} onChange={(e) => setEnrollForm({ ...enrollForm, dept: e.target.value })} placeholder="Enter your department" />
                                </Field>

                                <Field label="Password">
                                    <TextInput
                                        type="password"
                                        value={enrollForm.password}
                                        onChange={(e) => setEnrollForm({ ...enrollForm, password: e.target.value })}
                                        placeholder="Create a password"
                                    />
                                </Field>
                            </div>
                            <div style={{ marginTop: "10px" }}>
                                <Button
                                    onClick={doEnroll}
                                    disabled={loading || !enrollForm.name || !enrollForm.dept || !enrollForm.password || enrollForm.age === ""}
                                >
                                    <UserPlus size={13} /> Enroll student
                                </Button>
                            </div>
                        </RuledCard>
                    )}

                    {tab === "amend" && (
                        <RuledCard>
                            <StampMark text={amendStamp?.text || ""} tone={amendStamp?.tone || "var(--slate)"} show={!!amendStamp} />
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "20px" }}>
                                <div style={{ flex: 1 }}>
                                    <Field label="Student ID to amend">
                                        <TextInput
                                            value={amendId}
                                            onChange={(e) => setAmendId(e.target.value)}
                                            placeholder="e.g. 1231"
                                            onKeyDown={(e) => e.key === "Enter" && loadForAmend()}
                                        />
                                    </Field>
                                </div>
                                <Button onClick={loadForAmend} disabled={loading || !amendId} tone="slate">
                                    <ChevronRight size={13} /> Pull card
                                </Button>
                            </div>

                            {amendLoaded && (
                                <>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                                        <Field label="Full name">
                                            <TextInput value={amendForm.name} onChange={(e) => setAmendForm({ ...amendForm, name: e.target.value })} />
                                        </Field>
                                        <Field label="Age">
                                            <TextInput value={amendForm.age} onChange={(e) => setAmendForm({ ...amendForm, age: e.target.value })} />
                                        </Field>
                                        {/*<Field label="Department">*/}
                                        {/*  <TextInput value={amendForm.dept} onChange={(e) => setAmendForm({ ...amendForm, dept: e.target.value })} />*/}
                                        {/*</Field>*/}
                                    </div>
                                    <Button onClick={doAmend} disabled={loading}>
                                        <PenLine size={13} /> Save amendment
                                    </Button>
                                </>
                            )}

                            {!amendLoaded && (
                                <div style={{ color: "var(--ink-60)", fontSize: "13px" }}>
                                    Pull a card by ID, then edit its fields below.
                                </div>
                            )}
                        </RuledCard>
                    )}

                    {tab === "withdraw" && (
                        <RuledCard>
                            <StampMark text={withdrawStamp?.text || ""} tone={withdrawStamp?.tone || "var(--rust)"} show={!!withdrawStamp} />
                            <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                                <div style={{ flex: 1 }}>
                                    <Field label="Student ID to withdraw">
                                        <TextInput
                                            value={withdrawId}
                                            onChange={(e) => setWithdrawId(e.target.value)}
                                            placeholder="e.g. 1231"
                                            onKeyDown={(e) => e.key === "Enter" && doWithdraw()}
                                        />
                                    </Field>
                                </div>
                                <Button onClick={doWithdraw} disabled={loading || !withdrawId} tone="rust">
                                    <Trash2 size={13} /> Withdraw
                                </Button>
                            </div>
                            <div style={{ color: "var(--ink-60)", fontSize: "13px", marginTop: "18px" }}>
                                This pulls the card from the drawer for good — there is no undo.
                            </div>
                        </RuledCard>
                    )}
                </div>

                {/* Ledger */}
                <div style={{ marginTop: "26px" }}>
                    <div
                        style={{
                            color: "rgba(241,234,211,0.55)",
                            fontSize: "10.5px",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            marginBottom: "8px",
                        }}
                    >
                        Activity Ledger
                    </div>
                    <div
                        ref={ledgerEndRef}
                        style={{
                            background: "rgba(20,32,26,0.55)",
                            border: "1px solid rgba(241,234,211,0.14)",
                            borderRadius: "4px",
                            maxHeight: "160px",
                            overflowY: "auto",
                            padding: "10px 14px",
                        }}
                    >
                        {ledger.length === 0 && (
                            <div style={{ color: "rgba(241,234,211,0.4)", fontSize: "12.5px" }}>
                                No entries yet. Actions taken on the cards above are logged here.
                            </div>
                        )}
                        {ledger.map((entry, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    fontSize: "12.5px",
                                    color: "#F1EAD3",
                                    padding: "4px 0",
                                    borderBottom: i < ledger.length - 1 ? "1px solid rgba(241,234,211,0.08)" : "none",
                                }}
                            >
                                <span style={{ opacity: 0.45, minWidth: "72px" }}>{entry.time}</span>
                                <span style={{ minWidth: "70px", textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.8 }}>
                  {entry.action}
                </span>
                                <span
                                    style={{
                                        color:
                                            entry.status === "error" || entry.status === "declined"
                                                ? "#D98A7F"
                                                : entry.status === "removed"
                                                    ? "#D9B27D"
                                                    : "#8FD1B9",
                                    }}
                                >
                  {entry.status}
                </span>
                                <span style={{ opacity: 0.7 }}>{entry.detail}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ color: "rgba(241,234,211,0.35)", fontSize: "11px", marginTop: "14px", textAlign: "center" }}>
                    Points at your Spring Boot server &mdash; set the address under &ldquo;Server&rdquo; if it isn&rsquo;t on localhost:8080.
                    Ensure CORS is enabled on the backend for this origin.
                </div>
            </div>
        </div>
    );
}
