import React, { useState } from "react";
import { Search, UserPlus, PenLine, Trash2, ChevronRight, Settings2, X } from "lucide-react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');
`;

function Field({ label, children }) {
    return (
        <label style={{ display: "block", marginBottom: "14px" }}>
      <span
          style={{
              display: "block",
              fontSize: "11px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "var(--ink-60)",
              marginBottom: "6px",
          }}
      >
        {label}
      </span>
            {children}
        </label>
    );
}

function TextInput(props) {
    return (
        <input
            {...props}
            style={{
                width: "100%",
                background: "rgba(43,27,16,0.04)",
                border: "1.5px solid var(--ink-20)",
                borderRadius: "3px",
                color: "var(--ink)",
                fontFamily: "'Courier Prime', monospace",
                fontSize: "14px",
                padding: "9px 10px",
                outline: "none",
                boxSizing: "border-box",
            }}
        />
    );
}

const TONES = {
    brass: { bg: "var(--brass)", fg: "#2B1B10" },
    slate: { bg: "var(--slate)", fg: "#F3E6D2" },
    rust: { bg: "var(--rust)", fg: "#F3E6D2" },
};

function Button({ children, tone = "brass", disabled, onClick }) {
    const t = TONES[tone] || TONES.brass;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: t.bg,
                color: t.fg,
                border: "none",
                borderRadius: "3px",
                padding: "10px 16px",
                fontFamily: "'Courier Prime', monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
                transition: "transform 0.08s ease",
            }}
        >
            {children}
        </button>
    );
}

function Tab({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                background: active ? "var(--drawer)" : "transparent",
                color: active ? "#F3E6D2" : "rgba(243,230,210,0.55)",
                border: "1px solid rgba(243,230,210,0.18)",
                borderBottom: active ? "3px solid var(--brass)" : "1px solid rgba(243,230,210,0.18)",
                padding: "11px 8px",
                fontFamily: "'Courier Prime', monospace",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                cursor: "pointer",
            }}
        >
            {children}
        </button>
    );
}

function Card({ children }) {
    return (
        <div
            style={{
                background: "var(--parchment)",
                color: "var(--ink)",
                borderRadius: "6px",
                padding: "26px",
                boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
            }}
        >
            {children}
        </div>
    );
}

function StudentCard({ student }) {
    if (!student) return null;
    return (
        <div
            style={{
                marginTop: "18px",
                border: "1.5px dashed var(--ink-30)",
                borderRadius: "4px",
                padding: "16px 18px",
            }}
        >
            <div style={{ fontFamily: "'Special Elite', cursive", fontSize: "18px", marginBottom: "8px" }}>
                {student.name || "(unnamed)"}
            </div>
            <Row label="ID" value={student.id} />
            <Row label="Age" value={student.age} />
            <Row label="Department" value={student.department} />
            <Row label="Email" value={student.email} />
            {student.createdAt && <Row label="Created" value={fmtDate(student.createdAt)} />}
            {student.updatedAt && <Row label="Updated" value={fmtDate(student.updatedAt)} />}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "13px" }}>
            <span style={{ color: "var(--ink-60)" }}>{label}</span>
            <span>{value === undefined || value === null || value === "" ? "\u2014" : String(value)}</span>
        </div>
    );
}

function fmtDate(d) {
    try {
        return new Date(d).toLocaleString();
    } catch {
        return d;
    }
}

export default function StudentRecordsUI() {
    const [apiBase, setApiBase] = useState("http://localhost:8080");
    const [showSettings, setShowSettings] = useState(false);
    const [tab, setTab] = useState("lookup");
    const [loading, setLoading] = useState(false);
    const [log, setLog] = useState([]);

    // Lookup
    const [lookupId, setLookupId] = useState("");
    const [lookupResult, setLookupResult] = useState(null);

    // Enroll
    const [enrollForm, setEnrollForm] = useState({ name: "", age: "", department: "", email: "" });
    const [enrollResult, setEnrollResult] = useState(null);

    // Amend
    const [amendId, setAmendId] = useState("");
    const [amendForm, setAmendForm] = useState(null);

    // Withdraw
    const [withdrawId, setWithdrawId] = useState("");

    function pushLog(message, status = "success") {
        setLog((l) => [{ id: Date.now() + Math.random(), message, status, at: new Date() }, ...l].slice(0, 12));
    }

    async function request(path, options) {
        const res = await fetch(`${apiBase}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        const text = await res.text();
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = text;
        }
        return { ok: res.ok, status: res.status, data };
    }

    async function doLookup() {
        if (!lookupId) return;
        setLoading(true);
        setLookupResult(null);
        try {
            const { ok, data } = await request(`/getStudent/${lookupId}`);
            if (!ok) {
                pushLog(`Lookup #${lookupId}: ${typeof data === "string" ? data : "not found"}`, "declined");
            } else {
                setLookupResult(data);
                pushLog(`Pulled card for #${lookupId} \u2014 ${data.name}`, "success");
            }
        } catch (e) {
            pushLog(`Lookup #${lookupId}: could not reach server`, "declined");
        } finally {
            setLoading(false);
        }
    }

    async function doEnroll() {
        setLoading(true);
        try {
            const body = {
                name: enrollForm.name,
                age: Number(enrollForm.age),
                department: enrollForm.department,
                email: enrollForm.email,
            };
            const { ok, data } = await request("/create", { method: "POST", body: JSON.stringify(body) });
            if (!ok) {
                pushLog(`Enroll ${enrollForm.name || "student"}: ${typeof data === "string" ? data : "rejected"}`, "declined");
            } else {
                setEnrollResult(data);
                pushLog(`Enrolled ${data.name} as #${data.id}`, "success");
                setEnrollForm({ name: "", age: "", department: "", email: "" });
            }
        } catch (e) {
            pushLog("Enroll: could not reach server", "declined");
        } finally {
            setLoading(false);
        }
    }

    async function loadForAmend() {
        if (!amendId) return;
        setLoading(true);
        setAmendForm(null);
        try {
            const { ok, data } = await request(`/getStudent/${amendId}`);
            if (!ok) {
                pushLog(`Pull card #${amendId}: ${typeof data === "string" ? data : "not found"}`, "declined");
            } else {
                setAmendForm({ name: data.name || "", age: data.age ?? "", department: data.department || "", email: data.email || "" });
                pushLog(`Pulled card #${amendId} for amendment`, "success");
            }
        } catch (e) {
            pushLog(`Pull card #${amendId}: could not reach server`, "declined");
        } finally {
            setLoading(false);
        }
    }

    async function doAmend() {
        if (!amendId || !amendForm) return;
        setLoading(true);
        try {
            const body = {
                name: amendForm.name,
                age: Number(amendForm.age),
                department: amendForm.department,
                email: amendForm.email,
            };
            const { ok, data } = await request(`/updateStudent/${amendId}`, { method: "PUT", body: JSON.stringify(body) });
            if (!ok) {
                pushLog(`Amend #${amendId}: ${typeof data === "string" ? data : "rejected"}`, "declined");
            } else {
                pushLog(`Amended card #${amendId} \u2014 ${data.name}`, "success");
                setAmendForm({ name: data.name || "", age: data.age ?? "", department: data.department || "", email: data.email || "" });
            }
        } catch (e) {
            pushLog(`Amend #${amendId}: could not reach server`, "declined");
        } finally {
            setLoading(false);
        }
    }

    async function doWithdraw() {
        if (!withdrawId) return;
        setLoading(true);
        try {
            const { ok, data } = await request(`/deleteStudent/${withdrawId}`, { method: "DELETE" });
            if (!ok) {
                pushLog(`Withdraw #${withdrawId}: ${typeof data === "string" ? data : "rejected"}`, "declined");
            } else {
                pushLog(`Withdrew student #${withdrawId} from rolls`, "removed");
                setWithdrawId("");
            }
        } catch (e) {
            pushLog(`Withdraw #${withdrawId}: could not reach server`, "declined");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                "--ink": "#2B1B10",
                "--ink-60": "rgba(43,27,16,0.62)",
                "--ink-30": "rgba(43,27,16,0.3)",
                "--ink-20": "rgba(43,27,16,0.16)",
                "--parchment": "#F3E6D2",
                "--rule": "rgba(43,27,16,0.08)",
                "--brass": "#B8863B",
                "--rust": "#8B4226",
                "--slate": "#6F4E37",
                "--drawer": "#3E2B1D",
                fontFamily: "'Courier Prime', monospace",
                background: "radial-gradient(ellipse at top, #4A3222 0%, #3E2B1D 55%, #241811 100%)",
                minHeight: "100vh",
                padding: "40px 20px",
                boxSizing: "border-box",
            }}
        >
            <style>{FONTS}</style>
            <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: "26px" }}>
                    <h1
                        style={{
                            fontFamily: "'Special Elite', cursive",
                            color: "#F3E6D2",
                            fontSize: "30px",
                            margin: 0,
                            letterSpacing: "0.5px",
                        }}
                    >
                        Student Records
                    </h1>
                    <div style={{ color: "rgba(243,230,210,0.5)", fontSize: "12px", marginTop: "4px" }}>
                        create &middot; look up &middot; amend &middot; withdraw
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", marginBottom: "20px" }}>
                    <Tab active={tab === "lookup"} onClick={() => setTab("lookup")}>Lookup</Tab>
                    <Tab active={tab === "enroll"} onClick={() => setTab("enroll")}>Enroll</Tab>
                    <Tab active={tab === "amend"} onClick={() => setTab("amend")}>Amend</Tab>
                    <Tab active={tab === "withdraw"} onClick={() => setTab("withdraw")}>Withdraw</Tab>
                </div>

                <Card>
                    {tab === "lookup" && (
                        <>
                            <div style={{ marginBottom: "6px" }}>
                                <Field label="Student ID">
                                    <TextInput
                                        value={lookupId}
                                        onChange={(e) => setLookupId(e.target.value)}
                                        placeholder="e.g. 1"
                                        onKeyDown={(e) => e.key === "Enter" && doLookup()}
                                    />
                                </Field>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button onClick={doLookup} disabled={loading || !lookupId}>
                                        <Search size={13} /> Find
                                    </Button>
                                </div>
                            </div>
                            <StudentCard student={lookupResult} />
                        </>
                    )}

                    {tab === "enroll" && (
                        <>
                            <Field label="Name">
                                <TextInput
                                    value={enrollForm.name}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                                    placeholder="Full name"
                                />
                            </Field>
                            <Field label="Age">
                                <TextInput
                                    type="number"
                                    value={enrollForm.age}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, age: e.target.value })}
                                    placeholder="e.g. 20"
                                />
                            </Field>
                            <Field label="Department">
                                <TextInput
                                    value={enrollForm.department}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, department: e.target.value })}
                                    placeholder="e.g. Computer Science"
                                />
                            </Field>
                            <Field label="Email">
                                <TextInput
                                    type="email"
                                    value={enrollForm.email}
                                    onChange={(e) => setEnrollForm({ ...enrollForm, email: e.target.value })}
                                    placeholder="e.g. jane@example.com"
                                />
                            </Field>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button
                                    onClick={doEnroll}
                                    disabled={loading || !enrollForm.name || !enrollForm.department || !enrollForm.email || enrollForm.age === ""}
                                >
                                    <UserPlus size={13} /> Enroll student
                                </Button>
                            </div>
                            <StudentCard student={enrollResult} />
                        </>
                    )}

                    {tab === "amend" && (
                        <>
                            <div style={{ marginBottom: amendForm ? "20px" : "0" }}>
                                <Field label="Student ID to amend">
                                    <TextInput
                                        value={amendId}
                                        onChange={(e) => setAmendId(e.target.value)}
                                        placeholder="e.g. 1"
                                        onKeyDown={(e) => e.key === "Enter" && loadForAmend()}
                                    />
                                </Field>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button onClick={loadForAmend} disabled={loading || !amendId} tone="slate">
                                        <ChevronRight size={13} /> Pull card
                                    </Button>
                                </div>
                            </div>

                            {amendForm && (
                                <>
                                    <div style={{ borderTop: "1px solid var(--rule)", paddingTop: "16px" }}>
                                        <Field label="Name">
                                            <TextInput
                                                value={amendForm.name}
                                                onChange={(e) => setAmendForm({ ...amendForm, name: e.target.value })}
                                            />
                                        </Field>
                                        <Field label="Age">
                                            <TextInput
                                                type="number"
                                                value={amendForm.age}
                                                onChange={(e) => setAmendForm({ ...amendForm, age: e.target.value })}
                                            />
                                        </Field>
                                        <Field label="Department">
                                            <TextInput
                                                value={amendForm.department}
                                                onChange={(e) => setAmendForm({ ...amendForm, department: e.target.value })}
                                            />
                                        </Field>
                                        <Field label="Email">
                                            <TextInput
                                                type="email"
                                                value={amendForm.email}
                                                onChange={(e) => setAmendForm({ ...amendForm, email: e.target.value })}
                                            />
                                        </Field>
                                    </div>
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button onClick={doAmend} disabled={loading}>
                                            <PenLine size={13} /> Save amendment
                                        </Button>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {tab === "withdraw" && (
                        <div>
                            <Field label="Student ID to withdraw">
                                <TextInput
                                    value={withdrawId}
                                    onChange={(e) => setWithdrawId(e.target.value)}
                                    placeholder="e.g. 1"
                                    onKeyDown={(e) => e.key === "Enter" && doWithdraw()}
                                />
                            </Field>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button onClick={doWithdraw} disabled={loading || !withdrawId} tone="rust">
                                    <Trash2 size={13} /> Withdraw
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Ledger */}
                {log.length > 0 && (
                    <div style={{ marginTop: "18px" }}>
                        <div style={{ color: "rgba(243,230,210,0.45)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                            Activity
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {log.map((entry) => (
                                <div
                                    key={entry.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                        fontSize: "12px",
                                        padding: "7px 10px",
                                        background: "rgba(243,230,210,0.06)",
                                        borderRadius: "3px",
                                        borderLeft: `3px solid ${
                                            entry.status === "declined"
                                                ? "#D98A6B"
                                                : entry.status === "removed"
                                                    ? "#D9B27D"
                                                    : "#B7C48A"
                                        }`,
                                        color: "#F3E6D2",
                                    }}
                                >
                                    <span>{entry.message}</span>
                                    <span style={{ color: "rgba(243,230,210,0.4)", whiteSpace: "nowrap" }}>
                    {entry.at.toLocaleTimeString()}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Server settings */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "22px" }}>
                    <button
                        onClick={() => setShowSettings((s) => !s)}
                        style={{
                            background: "transparent",
                            border: "1px solid rgba(243,230,210,0.35)",
                            borderRadius: "3px",
                            color: "#F3E6D2",
                            padding: "9px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                            fontFamily: "'Courier Prime', monospace",
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
                            background: "rgba(243,230,210,0.08)",
                            border: "1px solid rgba(243,230,210,0.2)",
                            borderRadius: "4px",
                            padding: "14px 16px",
                            marginTop: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
            <span style={{ color: "#F3E6D2", fontSize: "11px", letterSpacing: "1px", opacity: 0.75, whiteSpace: "nowrap" }}>
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
                                borderBottom: "1.5px solid rgba(243,230,210,0.4)",
                                color: "#F3E6D2",
                                fontFamily: "'Courier Prime', monospace",
                                fontSize: "13px",
                                padding: "4px 2px",
                                outline: "none",
                            }}
                        />
                        <button onClick={() => setShowSettings(false)} style={{ background: "transparent", border: "none", color: "#F3E6D2", cursor: "pointer" }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div style={{ color: "rgba(243,230,210,0.35)", fontSize: "11px", marginTop: "10px", textAlign: "center" }}>
                    Points at your Spring Boot server &mdash; set the address under &ldquo;Server&rdquo; if it isn&rsquo;t on localhost:8080.
                    Ensure CORS is enabled on the backend for this origin.
                </div>
            </div>
        </div>
    );
}
