import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";
import { AuthShell } from "../layout/AuthShell.jsx";
import { Input } from "../components/Input.jsx";
import { Button } from "../components/Button.jsx";
import { Alert } from "../components/index.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverErr, setServerErr] = useState("");

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Minimum 8 characters";
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    setServerErr("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setServerErr(error.message || "Incorrect email or password. Please try again.");
      return;
    }

    navigate("/");
  };

  return (
    <AuthShell>
      <h1 className="text-xl font-semibold text-gray-900 tracking-tight mb-1">Sign in to Propflow</h1>
      <p className="text-[13px] text-gray-500 mb-6">Enter your credentials to access the dashboard.</p>

      {serverErr && <div className="mb-4"><Alert type="error">{serverErr}</Alert></div>}

      <div className="flex flex-col gap-4">
        <Input label="Work email" type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com.pk" error={errors.email} icon="ti-mail"
          onKeyDown={e => e.key === "Enter" && submit()} />

        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Min. 8 characters" error={errors.password} icon="ti-lock"
          onKeyDown={e => e.key === "Enter" && submit()} />

        <div className="flex justify-end -mt-2">
          <Link to="/forgot" className="text-[13px] text-brand-500 font-medium hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button fullWidth loading={loading} onClick={submit} icon="ti-arrow-right">
          Sign in
        </Button>
      </div>

      <div className="border-t border-gray-200 mt-6 pt-5 text-center">
        <span className="text-[13px] text-gray-500">Don't have an account? </span>
        <Link to="/signup" className="text-[13px] text-brand-500 font-medium hover:underline">
          Create one
        </Link>
      </div>
    </AuthShell>
  );
}
