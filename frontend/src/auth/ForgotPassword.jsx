import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { AuthShell } from "../layout/AuthShell.jsx";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import { Alert } from "../components/index.jsx";

export function ForgotPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(["","","","","",""]);
  const [codeErr, setCodeErr] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [pwErr, setPwErr] = useState(""); const [pw2Err, setPw2Err] = useState("");
  const [saving, setSaving] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const refs = useRef([]);

  const startTimer = () => {
    setCooldown(60);
    const iv = setInterval(() => setCooldown(v => { if (v <= 1) { clearInterval(iv); return 0; } return v - 1; }), 1000);
  };

  const sendCode = async () => {
    if (!email) { setEmailErr("Email is required"); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailErr("Enter a valid email address"); return; }
    setEmailErr(""); setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    setStep("code"); startTimer();
  };

  const handleCode = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...code]; n[i] = val.slice(-1); setCode(n); setCodeErr("");
    if (val && i < 5) refs.current[i + 1]?.focus();
  };
  const handleCodeKey = (i, e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus(); };

  const verifyCode = async () => {
    const token = code.join("");
    if (token.length < 6) { setCodeErr("Enter the full 6-digit code"); return; }
    setVerifying(true);
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "recovery" });
    setVerifying(false);
    if (error) { setCodeErr("Incorrect or expired code. Please try again."); setCode(["","","","","",""]); refs.current[0]?.focus(); return; }
    setStep("reset");
  };

  const resetPw = async () => {
    let ok = true;
    if (!pw || pw.length < 8) { setPwErr("Minimum 8 characters"); ok = false; } else setPwErr("");
    if (!pw2) { setPw2Err("Please confirm your password"); ok = false; } else if (pw2 !== pw) { setPw2Err("Passwords do not match"); ok = false; } else setPw2Err("");
    if (!ok) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setSaving(false);
    if (error) { setPwErr(error.message); return; }
    setStep("done");
  };

  if (step === "done") return (
    <AuthShell>
      <div className="text-center">
        <div className="w-[52px] h-[52px] bg-emerald-50 rounded-2xl inline-flex items-center justify-center mb-4">
          <i className="ti ti-circle-check text-emerald-600 text-2xl" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-2">Password updated</h1>
        <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">Your password has been changed successfully. You can now sign in with your new credentials.</p>
        <Button fullWidth onClick={() => navigate("/login")} icon="ti-arrow-left">Back to sign in</Button>
      </div>
    </AuthShell>
  );

  if (step === "reset") return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Set new password</h1>
      <p className="text-[13px] text-gray-500 mb-6">Choose a strong password you haven't used before.</p>
      <div className="flex flex-col gap-4">
        <Input label="New password" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Min. 8 characters" error={pwErr} icon="ti-lock" />
        <Input label="Confirm new password" type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Re-enter password" error={pw2Err} icon="ti-lock-check" />
        <Button fullWidth loading={saving} onClick={resetPw} icon="ti-check">Update password</Button>
      </div>
    </AuthShell>
  );

  if (step === "code") return (
    <AuthShell>
      <div className="text-center mb-6">
        <div className="w-[52px] h-[52px] bg-blue-50 rounded-2xl inline-flex items-center justify-center mb-4">
          <i className="ti ti-shield-lock text-brand-500 text-2xl" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1.5">Enter reset code</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed">A 6-digit code was sent to <strong className="text-gray-700">{email}</strong>.</p>
      </div>
      <div className="flex gap-2 justify-center mb-4">
        {code.map((d, i) => (
          <input key={i} ref={el => refs.current[i] = el} value={d} onChange={e => handleCode(i, e.target.value)} onKeyDown={e => handleCodeKey(i, e)} maxLength={1} inputMode="numeric"
            className={`w-11 text-center text-xl font-semibold font-mono rounded-xl border outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100 ${codeErr ? "border-red-400" : d ? "border-brand-500" : "border-gray-300"}`}
            style={{ height: 52 }}
            onFocus={e => { e.target.style.borderColor = "#1C64F2"; }} onBlur={e => { e.target.style.borderColor = codeErr ? "#F87171" : d ? "#1C64F2" : "#D1D5DB"; }}
          />
        ))}
      </div>
      {codeErr && <div className="mb-3"><Alert type="error">{codeErr}</Alert></div>}
      <Button fullWidth loading={verifying} onClick={verifyCode} icon="ti-arrow-right">Verify code</Button>
      <div className="text-center mt-4 text-[13px] text-gray-500">
        {cooldown > 0 ? <span className="text-gray-400">Resend in {cooldown}s</span> : <button onClick={() => { setCode(["","","","","",""]); sendCode(); }} className="text-brand-500 font-medium hover:underline">Resend code</button>}
      </div>
    </AuthShell>
  );

  return (
    <AuthShell>
      <Link to="/login" className="flex items-center gap-1.5 text-[13px] text-gray-500 mb-5 hover:text-gray-700">
        <i className="ti ti-arrow-left text-[15px]" aria-hidden /> Back to sign in
      </Link>
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Reset your password</h1>
      <p className="text-[13px] text-gray-500 mb-6">Enter your registered email and we will send you a reset code.</p>
      <div className="flex flex-col gap-4">
        <Input label="Work email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com.pk" error={emailErr} icon="ti-mail" onKeyDown={e => e.key === "Enter" && sendCode()} />
        <Button fullWidth loading={loading} onClick={sendCode} icon="ti-send">Send reset code</Button>
      </div>
    </AuthShell>
  );
}
