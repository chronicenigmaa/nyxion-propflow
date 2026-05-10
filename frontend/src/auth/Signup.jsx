import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { AuthShell } from "../layout/AuthShell.jsx";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import { Alert } from "../components/index.jsx";

function OtpInput({ value, onChange, error }) {
  const refs = useRef([]);

  const handleChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...value];
    next[i] = val.slice(-1);
    onChange(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {value.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          value={d}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          maxLength={1}
          inputMode="numeric"
          className={`w-11 h-13 text-center text-xl font-semibold font-mono rounded-xl border outline-none transition-all
            ${error ? "border-red-400" : d ? "border-brand-500" : "border-gray-300"}
            focus:border-brand-500 focus:ring-2 focus:ring-brand-100`}
          style={{ height: 52 }}
        />
      ))}
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [codeErr, setCodeErr] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.company.trim()) e.company = "Company name is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Minimum 8 characters";
    else if (!/[A-Z]/.test(form.password)) e.password = "Must include an uppercase letter";
    else if (!/[0-9]/.test(form.password)) e.password = "Must include a number";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password) e.confirm = "Passwords do not match";
    return e;
  };

  const startTimer = () => {
    setCooldown(60);
    const iv = setInterval(() => setCooldown(v => { if (v <= 1) { clearInterval(iv); return 0; } return v - 1; }), 1000);
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setServerErr("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, company: form.company } },
    });

    setLoading(false);
    if (error) { setServerErr(error.message); return; }
    setStep("verify");
    startTimer();
  };

  const verify = async () => {
    const token = code.join("");
    if (token.length < 6) { setCodeErr("Enter the full 6-digit code"); return; }
    setVerifying(true);

    const { error } = await supabase.auth.verifyOtp({
      email: form.email,
      token,
      type: "signup",
    });

    setVerifying(false);
    if (error) { setCodeErr("Incorrect code. Please check your email and try again."); setCode(["", "", "", "", "", ""]); return; }
    navigate("/");
  };

  const pwScore = () => {
    const p = form.password; if (!p) return null;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return { s, label: ["Weak", "Fair", "Good", "Strong"][s - 1] || "Weak", color: ["#E02424", "#B45309", "#1C64F2", "#057A55"][s - 1] || "#E02424" };
  };
  const pw = pwScore();

  if (step === "verify") return (
    <AuthShell>
      <div className="text-center mb-6">
        <div className="w-13 h-13 bg-blue-50 rounded-2xl inline-flex items-center justify-center mb-4" style={{ width: 52, height: 52 }}>
          <i className="ti ti-mail-forward text-brand-500 text-2xl" aria-hidden />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1.5">Check your inbox</h1>
        <p className="text-[13px] text-gray-500 leading-relaxed">
          We sent a 6-digit code to <strong className="text-gray-700">{form.email}</strong>. It expires in 10 minutes.
        </p>
      </div>

      <div className="mb-4">
        <OtpInput value={code} onChange={setCode} error={!!codeErr} />
      </div>
      {codeErr && <div className="mb-3"><Alert type="error">{codeErr}</Alert></div>}

      <Button fullWidth loading={verifying} onClick={verify} icon="ti-circle-check">Verify email</Button>

      <div className="text-center mt-5 text-[13px] text-gray-500">
        Didn't receive it?{" "}
        {cooldown > 0
          ? <span className="text-gray-400">Resend in {cooldown}s</span>
          : <button onClick={() => { setCode(["","","","","",""]); startTimer(); }} className="text-brand-500 font-medium hover:underline">Resend code</button>}
      </div>
    </AuthShell>
  );

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Create your account</h1>
      <p className="text-[13px] text-gray-500 mb-6">Set up Propflow for your property business in minutes.</p>

      {serverErr && <div className="mb-4"><Alert type="error">{serverErr}</Alert></div>}

      <div className="flex flex-col gap-3.5">
        <Input label="Full name" value={form.name} onChange={set("name")} placeholder="e.g. Arif Khan" error={errors.name} icon="ti-user" />
        <Input label="Work email" type="email" value={form.email} onChange={set("email")} placeholder="you@company.com.pk" error={errors.email} icon="ti-mail" />
        <Input label="Company / business name" value={form.company} onChange={set("company")} placeholder="e.g. Nyxion Properties Pvt. Ltd." error={errors.company} icon="ti-building" />

        <div>
          <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 chars, 1 uppercase, 1 number" error={errors.password} icon="ti-lock" />
          {pw && (
            <div className="mt-1.5">
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex-1 h-[3px] rounded-sm transition-all duration-200"
                    style={{ background: i <= pw.s ? pw.color : "#E5E7EB" }} />
                ))}
              </div>
              <span className="text-[11px] font-medium" style={{ color: pw.color }}>{pw.label}</span>
            </div>
          )}
        </div>

        <Input label="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} placeholder="Re-enter your password" error={errors.confirm} icon="ti-lock-check" />

        <Button fullWidth loading={loading} onClick={submit} icon="ti-send">Create account</Button>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-5 text-center">
        <span className="text-[13px] text-gray-500">Already have an account? </span>
        <Link to="/login" className="text-[13px] text-brand-500 font-medium hover:underline">Sign in</Link>
      </div>
    </AuthShell>
  );
}
