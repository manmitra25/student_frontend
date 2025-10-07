import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";
import {
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Heart,
  UserCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../../App";
import LoadingSpinner from "../shared/LoadingSpinner";
import API from "../../api/axios";

interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  college: string;
  role: "student" | "counsellor" | "";
  name: string;
  verificationCode: string;
}

interface RegistrationErrors
  extends Partial<Record<keyof RegistrationData, string>> {
  general?: string; // for backend errors not tied to a field
}

const colleges = [
  { id: "MIT", name: "MIT" },
  { id: "BITS", name: "BITS" },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    password: "",
    confirmPassword: "",
    college: "",
    role: "",
    name: "",
    verificationCode: "",
  });

  const [errors, setErrors] = useState<RegistrationErrors>({});
  const { setUser } = useApp();
  const navigate = useNavigate();

  // -------- Validation Helpers --------
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25)
      return { text: "Getting started", color: "text-warm-coral" };
    if (strength < 50)
      return { text: "Getting stronger", color: "text-warm-coral" };
    if (strength < 75)
      return { text: "Looking good", color: "text-healing-green" };
    return { text: "Great choice!", color: "text-healing-green" };
  };

  // -------- Navigation Handlers --------
  const handleBack = () => setStep(step - 1);

  const handleResendCode = async () => {
    setResendCountdown(30);
    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      await API.post("/student/signup", {
        email: formData.email,
        password: formData.password,
        collegeName: formData.college,
      });
    } catch (e) {
      // ignore resend errors
    }
  };

  // -------- Step Navigation --------
  const handleNext = async () => {
    const newErrors: RegistrationErrors = {};

    // Step 1: Email & Password Validation
    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Please enter a valid email";

      if (!formData.password) newErrors.password = "Password is required";
      else if (!validatePassword(formData.password))
        newErrors.password = "Password must be at least 8 characters";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    // Step 2: Profile Setup Validation
    if (step === 2) {
      if (!formData.college) newErrors.college = "Please select your college";
      if (!formData.role) newErrors.role = "Please select your role";
      if (!formData.name) newErrors.name = "Name is required";
    }

    // Step 3: Verification Code Validation
    if (step === 3) {
      if (!formData.verificationCode)
        newErrors.verificationCode = "Verification code is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      setIsLoading(true);

      // -------- Step 2: Signup API call --------
      if (step === 2) {
        try {
          await API.post("/student/signup", {
            email: formData.email,
            password: formData.password,
            collegeName: formData.college,
          });

          setVerificationSent(true);
          setStep(3);
        } catch (err: any) {
          const message =
            err?.response?.data?.message ||
            "Something went wrong. Please try again.";
          // Use general field to show backend errors
          setErrors({ general: message });
          return; // stop moving to next step
        }
      }

      // -------- Step 3: Verify OTP --------
      else if (step === 3) {
        const { data } = await API.post("/student/verify-signup", {
          email: formData.email,
          otp: formData.verificationCode,
        });

        if (data?.token) sessionStorage.setItem("token", data.token);

        const newUser = {
          id: data?.user?.id || "me",
          email: data?.user?.email || formData.email,
          name: data?.user?.name || formData.name,
          role: data?.user?.role === "counsellor" ? "counsellor" : "student",
          college: data?.user?.college || formData.college,
          isNewUser: true,
        } as const;

        sessionStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser as any);
        navigate("/welcome");
      }

      // -------- Step 1: Move to next step --------
      else setStep(step + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mm-text-h1 text-foreground mb-2">Join ManMitra</h1>

          <p className="mm-text-body text-muted-foreground">
            Step {step} of 3 -{" "}
            {step === 1
              ? "Account Details"
              : step === 2
              ? "Profile Setup"
              : "Verification"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        <Card className="mm-card mm-p-4">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`mm-input ${
                      errors.email
                        ? "border-destructive"
                        : validateEmail(formData.email) && formData.email
                        ? "border-secondary"
                        : ""
                    }`}
                    placeholder="your.email@college.edu"
                  />
                  {validateEmail(formData.email) && formData.email && (
                    <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-secondary" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password fields */}
              <div>
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`mm-input ${
                      errors.password ? "border-destructive" : ""
                    }`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mm-text-small mb-1">
                      <span
                        className={
                          getPasswordStrengthText(
                            getPasswordStrength(formData.password)
                          ).color
                        }
                      >
                        {
                          getPasswordStrengthText(
                            getPasswordStrength(formData.password)
                          ).text
                        }
                      </span>

                      <span className="text-muted-foreground">
                        {getPasswordStrength(formData.password)}% strong
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          getPasswordStrength(formData.password) < 50
                            ? "bg-accent"
                            : "bg-secondary"
                        }`}
                        style={{
                          width: `${getPasswordStrength(formData.password)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`mm-input ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Show backend/general error */}
              {errors.general && (
                <p className="text-destructive mm-text-small text-center mb-4">
                  {errors.general}
                </p>
              )}

              <div>
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`mm-input mt-2 ${
                    errors.name ? "border-destructive" : ""
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground">College/Institution</Label>
                <Select
                  value={formData.college}
                  onValueChange={(value) =>
                    setFormData({ ...formData, college: value })
                  }
                >
                  <SelectTrigger
                    className={`mt-2 ${
                      errors.college ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select your college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        <div className="flex items-center mm-gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          {college.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.college && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.college}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-foreground mb-4 block">I am a...</Label>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "student" })
                    }
                    className={`mm-card w-full p-6 text-left transition-all hover:scale-[1.02] ${
                      formData.role === "student"
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start mm-gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          formData.role === "student"
                            ? "bg-primary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mm-text-h3 text-foreground mb-1">
                          Student
                        </h3>
                        <p className="mm-text-small text-muted-foreground">
                          I'm seeking support
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "counsellor" })
                    }
                    className={`mm-card w-full p-6 text-left transition-all hover:scale-[1.02] ${
                      formData.role === "counsellor"
                        ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/10"
                        : "hover:border-secondary/50"
                    }`}
                  >
                    <div className="flex items-start mm-gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                          formData.role === "counsellor"
                            ? "bg-secondary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mm-text-h3 text-foreground mb-1">
                          Counselor
                        </h3>
                        <p className="mm-text-small text-muted-foreground">
                          I'm here to help
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
                {errors.role && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.role}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>

              <div>
                <h3 className="mm-text-h2 text-foreground mb-2">
                  Check your email
                </h3>
                <p className="mm-text-body text-muted-foreground mb-6">
                  We sent a verification code to
                  <br />
                  <span className="font-medium text-primary">{formData.email}</span>
                </p>

                <Input
                  placeholder="Enter OTP"
                  value={formData.verificationCode}
                  onChange={(e) =>
                    setFormData({ ...formData, verificationCode: e.target.value })
                  }
                  className={errors.verificationCode ? "border-destructive" : ""}
                />
                {errors.verificationCode && (
                  <p className="text-destructive mm-text-small mt-1">
                    {errors.verificationCode}
                  </p>
                )}

                <Button
                  variant="link"
                  onClick={handleResendCode}
                  disabled={resendCountdown > 0}
                  className="mt-4"
                >
                  {resendCountdown > 0
                    ? `Resend code in ${resendCountdown}s`
                    : "Resend code"}
                </Button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="ml-auto"
            >
              {isLoading ? <LoadingSpinner size={4} /> : step === 3 ? "Verify" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
