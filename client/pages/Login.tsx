import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../App";
import { postData } from "@/lib/api";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";

export default function Login() {
  const context = useContext(MyContext);
  const history = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const auth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
  });
  const [formvalues, setFormvalues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    clinicname: "",
    clinicphone: "",
    clinicemail: "",
  });
  const handleGoogleAuth = () => {
    console.log(auth);
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;

        const fields = {
          name: user.providerData[0].displayName,
          email: user.providerData[0].email,
          password: null,
          images: user.providerData[0].photoURL,
          phone: user.providerData[0].phoneNumber,
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
          console.log("formvalues", fields);
          console.log("res", res);
          localStorage.setItem(
            "existingUser",
            JSON.stringify(res?.existingUser),
          );
          try {
            if (res.error !== true) {
              localStorage.setItem("token", res.token);
              const user = {
                name: res.existingUser?.name,
                email: res.existingUser?.email,
                userId: res.existingUser?.id,
                phone: res.existingUser?.phone,
                founder: res.existingUser?.founder,
                clinicId: Array.isArray(res.existingUser?.clinicid)
                  ? res.existingUser.clinicid[0]
                  : undefined,
                images: Array.isArray(res.existingUser?.images)
                  ? res.existingUser.images[0]
                  : undefined,
                clinicname: Array.isArray(res?.findClinic)
                  ? res.findClinic[0]?.clinicname
                  : undefined,
                clinicemail: Array.isArray(res?.findClinic)
                  ? res.findClinic[0]?.clinicemail
                  : undefined,
                clinicphone: Array.isArray(res?.findClinic)
                  ? res.findClinic[0]?.clinicphone
                  : undefined,
              };
              console.log("user of login", user);

              localStorage.setItem("user", JSON.stringify(user));
              context.setUser(JSON.stringify(user));
              setTimeout(() => {
                if (res?.existingUser?.clinicid?.length === 0) {
                  history("/clinicform");

                  setIsLoading(false);
                } else {
                  history("/home");

                  setIsLoading(false);
                }
              }, 2000);
            } else {
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error);
            setIsLoading(false);
          }
        });
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      if (!formfields.email || !formfields.password) {
        setAlertMsg("Email and password are required");
        setAlertOpen(true);
        return;
      }

      console.log("Sign In Data:", formfields);
      postData("/api/user/signin", formfields).then((res) => {
        console.log("formvalues", formfields);
        console.log("res:", res);
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "existingUser",
          res.user?.existingUser ? JSON.stringify(res.user.existingUser) : "{}",
        );
        localStorage.setItem("loginTime", Date.now().toString());

        try {
          if (res.error !== true && res.user) {
            const existingUser = res.user?.existingUser;
            const findClinic = res.user?.findClinic ?? [];
            const findAddress = res.user?.findAddress ?? [];
            const findAssociation = res.user?.findAssociation ?? {
              clinicid: [],
            };
            let user;

            if (findClinic != null) {
              user = {
                name: existingUser?.name,
                email: existingUser?.email,
                userId: existingUser?.id,
                founder: existingUser?.founder,
                images: existingUser?.images?.[0] ?? "",
                clinicId: findClinic[0]?._id ?? null,
                isAdmin: existingUser?.isAdmin ?? false,
                clinicname: findClinic?.[0]?.clinicname ?? "N/A",
                clinicemail: findClinic?.[0]?.clinicemail ?? "N/A",
                state: findAddress?.[0].state ?? "N/A",
                isVerified: findClinic?.[0]?.isVerified,
                subscription: res.user.subscription,
              };
            } else {
              user = {
                name: existingUser?.name,
                email: existingUser?.email,
                userId: existingUser?.id,
                founder: existingUser?.founder,
                images: existingUser?.images?.[0] ?? "",
                isAdmin: existingUser?.isAdmin ?? false,
                clinicId: findClinic[0]?._id ?? null,
                clinicname: findClinic?.[0]?.clinicname ?? "N/A",
                clinicemail: findClinic?.[0]?.clinicemail ?? "N/A",
                clinicphone: findClinic?.[0]?.clinicphone ?? "N/A",
                state: findAddress?.[0]?.state ?? "N/A",
                isVerified: findClinic?.[0]?.isVerified,
                subscription: res.user.subscription,
              };
            }
            console.log(" user:", user);
            if ((res.user?.findAssociation?.clinicid ?? []).length === 0) {
            }

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("images", JSON.stringify(user?.images));
            setTimeout(() => {
              if (
                Array.isArray(res.user?.findClinic) &&
                res.user.findClinic.length > 0 &&
                Array.isArray(res.user.findClinic[0].speciesid) &&
                res.user.findClinic[0].speciesid.length === 0
              ) {
                console.log("Clinic route");
                history("/clinicform");
              } else {
                console.log("Home");
                history("/home");
              }
            }, 2000);
          } else {
            setAlertMsg(res.msg || "Login failed.");
            setAlertOpen(true);
          }
        } catch (error) {
          console.log(error);
        }
      });
    } else {
      if (
        !formvalues.name ||
        !formvalues.email ||
        !formvalues.password ||
        !formvalues.clinicname ||
        !formvalues.clinicphone ||
        !formvalues.clinicemail
      ) {
        setAlertMsg("All fields are required");
        setAlertOpen(true);
        return;
      }

      console.log("Sign Up Data:", formvalues);
      postData("/api/user/signup", formvalues).then((res) => {
        console.log("formvalues", formvalues);
        console.log("res:", res);
        localStorage.setItem("token", res.token);
        localStorage.setItem(
          "existingUser",
          res.user?.existingUser ? JSON.stringify(res.user.existingUser) : "{}",
        );
        localStorage.setItem("loginTime", Date.now().toString());

        try {
          if (res.error !== true) {
            console.log(`IF`);
            let user;
            const existingUser = res.user?.existingUser;
            const findClinic = res.user?.findClinic ?? [];
            const findAddress = res.user?.findAddress ?? [];
            const findAssociation = res.user?.findAssociation ?? {
              clinicid: [],
            };
            if (res.user.findClinic != null) {
              console.log("IF Enter", res.user.findAssociation.clinicid[0]);
              user = {
                name: existingUser?.name,
                email: existingUser?.email,
                userId: existingUser?.id,
                founder: existingUser?.founder,
                images: existingUser?.images?.[0] ?? "",
                clinicId: findClinic[0]?._id ?? null,
                isAdmin: existingUser?.isAdmin ?? false,
                clinicname: findClinic?.[0]?.clinicname ?? "N/A",
                clinicemail: findClinic?.[0]?.clinicemail ?? "N/A",
                state: findAddress?.[0].state ?? "N/A",
                isVerified: findClinic?.[0]?.isVerified,
                subscription: res.user.subscription,
              };
            } else {
              console.log("ELSE Enter");
              user = {
                name: existingUser?.name,
                email: existingUser?.email,
                userId: existingUser?.id,
                founder: existingUser?.founder,
                images: existingUser?.images?.[0] ?? "",
                isAdmin: existingUser?.isAdmin ?? false,
                clinicId: findClinic[0]?._id ?? null,
                clinicname: findClinic?.[0]?.clinicname ?? "N/A",
                clinicemail: findClinic?.[0]?.clinicemail ?? "N/A",
                clinicphone: findClinic?.[0]?.clinicphone ?? "N/A",
                state: findAddress?.[0]?.state ?? "N/A",
                isVerified: findClinic?.[0]?.isVerified,
                subscription: res.user.subscription,
              };
            }
            console.log(" user:", user);
            if ((res.user?.findAssociation?.clinicid ?? []).length === 0) {
            }

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("images", JSON.stringify(user?.images));
            setTimeout(() => {
              if (
                Array.isArray(res.user?.findClinic) &&
                res.user.findClinic.length > 0 &&
                Array.isArray(res.user.findClinic[0].speciesid) &&
                res.user.findClinic[0].speciesid.length === 0
              ) {
                console.log("Clinic route");
                history("/clinicform");
              } else {
                console.log("Home");
                history("/clinicform");
              }
            }, 2000);
          } else {
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  };
  const handleForgotPasswordNext = async (e: React.FormEvent) => {
    e.preventDefault();

    if (forgotPasswordStep === 1 && forgotPasswordEmail) {
      setForgotMsg("Sending...");
      try {
        const res = await postData("/api/user/forget-password", {
          email: forgotPasswordEmail,
        });
        if (res.error || res.status === "FAILED") {
          setForgotMsg(res.msg || "Failed to send reset link.");
        } else {
          setForgotMsg("OTP sent! Please check your email.");
          setForgotPasswordStep(2);
        }
      } catch (error) {
        setForgotMsg("Something went wrong.");
      }
    } else if (
      forgotPasswordStep === 2 &&
      otpCode &&
      newPassword &&
      confirmNewPassword
    ) {
      if (newPassword !== confirmNewPassword) {
        setForgotMsg("Passwords do not match.");
        return;
      }

      setForgotMsg("Verifying OTP and resetting password...");
      try {
        const res = await postData("/api/user/verify-otp", {
          email: forgotPasswordEmail,
          otp: otpCode,
          newPassword,
        });

        if (res.success || res.status === "OK") {
          setForgotPasswordStep(4);
          setForgotMsg("Password reset successful!");
        } else {
          setForgotMsg(res.msg || "Invalid OTP or failed to reset password.");
        }
      } catch (err) {
        console.error(err);
        setForgotMsg("Something went wrong.");
      }
    } else if (
      forgotPasswordStep === 3 &&
      newPassword &&
      confirmNewPassword &&
      newPassword === confirmNewPassword
    ) {
      setForgotMsg("Resetting password...");
      try {
        const res = await postData("/api/user/reset-password", {
          email: forgotPasswordEmail,
          newPassword,
        });

        if (res.success || res.status === "OK") {
          setForgotPasswordStep(4);
          setForgotMsg("Password reset successfully!");
        } else {
          setForgotMsg(res.msg || "Failed to reset password.");
        }
      } catch (error) {
        console.error(error);
        setForgotMsg("Error resetting password.");
      }
    }
  };

  const resetForgotPasswordFlow = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setForgotPasswordEmail("");
    setOtpCode("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-linear-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="w-[120px] h-[40px] bg-primary-dark-blue rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-neutral-0 font-gabarito font-bold text-lg">
                PetMart
              </span>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${
                        step <= forgotPasswordStep
                          ? "bg-primary-dark-blue text-white"
                          : "bg-neutral-20 text-neutral-60"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-8 h-0.5 mx-1 ${
                          step < forgotPasswordStep
                            ? "bg-primary-dark-blue"
                            : "bg-neutral-20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {forgotPasswordStep === 1 && (
              <>
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-neutral-60">
                  Enter your email address and we'll send you an OTP to reset
                  your password.
                </CardDescription>
              </>
            )}

            {forgotPasswordStep === 2 && (
              <>
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  Enter OTP
                </CardTitle>
                <CardDescription className="text-neutral-60">
                  We've sent a 6-digit code to {forgotPasswordEmail}. Enter it
                  below.
                </CardDescription>
              </>
            )}

            {forgotPasswordStep === 3 && (
              <>
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  Set New Password
                </CardTitle>
                <CardDescription className="text-neutral-60">
                  Choose a strong password for your account.
                </CardDescription>
              </>
            )}

            {forgotPasswordStep === 4 && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-gabarito font-bold text-primary-dark-blue">
                  Password Reset Successful!
                </CardTitle>
                <CardDescription className="text-neutral-60">
                  Your password has been reset successfully. You can now sign in
                  with your new password.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {forgotPasswordStep < 4 && (
              <form onSubmit={handleForgotPasswordNext} className="space-y-4">
                {forgotPasswordStep === 1 && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="reset-email"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                )}

                {forgotPasswordStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="otp-code"
                        className="text-neutral-80 font-gabarito font-bold"
                      >
                        OTP Code
                      </Label>
                      <Input
                        id="otp-code"
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="rounded-lg border-neutral-40 focus:border-primary-dark-blue text-center text-lg tracking-widest"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-neutral-80 font-gabarito font-bold"
                      >
                        New Password
                      </Label>
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-new-password"
                        className="text-neutral-80 font-gabarito font-bold"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-new-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                        required
                      />
                    </div>

                    {newPassword &&
                      confirmNewPassword &&
                      newPassword !== confirmNewPassword && (
                        <p className="text-red-500 text-sm">
                          Passwords do not match
                        </p>
                      )}
                  </>
                )}

                {forgotPasswordStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label
                        htmlFor="new-password"
                        className="text-neutral-80 font-gabarito font-bold"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="rounded-lg border-neutral-40 focus:border-primary-dark-blue pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-neutral-40" />
                          ) : (
                            <Eye className="h-4 w-4 text-neutral-40" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirm-new-password"
                        className="text-neutral-80 font-gabarito font-bold"
                      >
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-new-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) =>
                            setConfirmNewPassword(e.target.value)
                          }
                          placeholder="Confirm new password"
                          className="rounded-lg border-neutral-40 focus:border-primary-dark-blue pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-neutral-40" />
                          ) : (
                            <Eye className="h-4 w-4 text-neutral-40" />
                          )}
                        </Button>
                      </div>
                      {newPassword &&
                        confirmNewPassword &&
                        newPassword !== confirmNewPassword && (
                          <p className="text-red-500 text-sm">
                            Passwords do not match
                          </p>
                        )}
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 rounded-lg py-3 font-gabarito font-bold"
                  disabled={
                    (forgotPasswordStep === 1 && !forgotPasswordEmail) ||
                    (forgotPasswordStep === 2 && !otpCode) ||
                    (forgotPasswordStep === 3 &&
                      (!newPassword ||
                        !confirmNewPassword ||
                        newPassword !== confirmNewPassword))
                  }
                >
                  {forgotPasswordStep === 1 && "Send OTP"}
                  {forgotPasswordStep === 2 && "Verify OTP"}
                  {forgotPasswordStep === 3 && "Reset Password"}
                </Button>

                {forgotPasswordStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-neutral-40 hover:bg-secondary-yellow40 flex items-center justify-center space-x-2"
                    onClick={() =>
                      setForgotPasswordStep(forgotPasswordStep - 1)
                    }
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                )}
              </form>
            )}

            {forgotPasswordStep === 4 && (
              <Button
                className="w-full bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 rounded-lg py-3 font-gabarito font-bold"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Login
              </Button>
            )}

            {forgotPasswordStep === 1 && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-primary-dark-blue hover:bg-secondary-yellow40 mt-4"
                onClick={resetForgotPasswordFlow}
              >
                Back to Login
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-gradient flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card
        className={`w-full mx-auto ${
          isLogin ? "max-w-md" : "max-w-2xl p-6 rounded-xl shadow-md bg-white"
        }`}
      >
        {" "}
        <CardHeader className="text-center">
          <CardTitle className="heading-36pxbold">
            {isLogin && "Sign in to Your Account"}
          </CardTitle>
          <CardDescription className="text-neutral-60">
            {!isLogin && (
              <div className="text-center mb-6">
                <h1 className="text-2xl md:text-3xl font-bold font-gabarito text-primary-dark-blue">
                  Let’s create your veterinary practice's purchasing account!
                </h1>
                <p className="text-neutral-80 text-base mt-2">
                  Signing up for IndiaVetMart is fast and free – you’ll be up
                  and running in under a minute
                </p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="yourName"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Your Name
                    </Label>
                    <Input
                      id="yourName"
                      value={formvalues.name}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter Your Name"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="yourEmail"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Your Email
                    </Label>
                    <Input
                      id="userEmail"
                      value={formvalues.email}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter Your Email"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Your Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formvalues.phone}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Enter Phone Number"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="signupPassword"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Password
                    </Label>
                    <Input
                      id="signupPassword"
                      type={showPassword ? "text" : "password"}
                      value={formvalues.password}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Enter Password"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="clinicName"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Clinic Name
                    </Label>
                    <Input
                      id="clinicName"
                      value={formvalues.clinicname}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          clinicname: e.target.value,
                        }))
                      }
                      placeholder="Enter Clinic Name"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="clinicEmail"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Clinic Email
                    </Label>
                    <Input
                      id="clinicEmail"
                      type="email"
                      value={formvalues.clinicemail}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          clinicemail: e.target.value,
                        }))
                      }
                      placeholder="Enter Clinic Email"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="clinicPhone"
                      className="text-neutral-80 font-gabarito font-bold"
                    >
                      Clinic Phone Number
                    </Label>
                    <Input
                      id="clinicPhone"
                      value={formvalues.clinicphone}
                      onChange={(e) =>
                        setFormvalues((prev) => ({
                          ...prev,
                          clinicphone: e.target.value,
                        }))
                      }
                      placeholder="Enter Clinic Phone Number"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-neutral-80 font-gabarito font-bold"
                  >
                    Your Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter Your Email"
                    className="rounded-lg border-neutral-40 focus:border-primary-dark-blue"
                    value={formfields.email}
                    onChange={(e) => {
                      setFormfields((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-neutral-80 font-gabarito font-bold"
                  >
                    Your Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      className="rounded-lg border-neutral-40 focus:border-primary-dark-blue pr-10"
                      value={formfields.password}
                      onChange={(e) => {
                        setFormfields((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }));
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-neutral-40" />
                      ) : (
                        <Eye className="h-4 w-4 text-neutral-40" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="text-primary-dark-blue hover:text-primary-dark-blue80 p-0"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary-dark-blue hover:bg-primary-dark-blue80 text-neutral-0 rounded-lg py-3 font-gabarito font-bold"
            >
              {isLogin ? "Sign In" : "Register"}
            </Button>
            <div className="text-center">
              <span className="text-neutral-60 text-sm">
                {isLogin ? "Need an account?" : "Already have an account?"}
              </span>
              <Button
                type="button"
                variant="link"
                className="text-primary-dark-blue hover:text-primary-dark-blue80 ml-1 p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up for IndiaVetMart" : "Sign in"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-neutral-60">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg border-neutral-40 hover:bg-secondary-yellow40"
              onClick={handleGoogleAuth}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
