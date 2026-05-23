import AuthLayout from "../auth/AuthLayout";
import { useForm, SubmitHandler } from "react-hook-form";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import { useState } from "react";
import { storeUserInfo } from "../../services/auth.service";
import toast, { Toaster } from "react-hot-toast";
import {
  useEmailVerifyMutation,
  useVerifyOtpMutation,
} from "../../redux/apis/otp.verify.api";
import { useRegisterUserMutation } from "../../redux/apis/auth.api";
import { useNavigate } from "react-router-dom";

interface IRegisterInfo {
  name: string;
  email: string;
  password: string;
}

interface Inputs extends IRegisterInfo {
  confirmPassword: string;
  otp: string;
}

const getPasswordError = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return "";
};

const SignUpComponent = () => {
  const navigate = useNavigate();

  const [emailVerify] = useEmailVerifyMutation();
  const [verifyOtp] = useVerifyOtpMutation();
  const [registerUser] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [showOtpField, setShowOtpField] = useState<boolean>(false);
  const [registerInfo, setRegisterInfo] = useState<IRegisterInfo>();
  const [expiredAt, setExpiredAt] = useState(0);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const otp = watch("otp");

  const passwordError = password ? getPasswordError(password) : "";

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const otpPayload = {
      name: data.name,
      email: data.email,
    };

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsBusy(true);

    try {
      const res = await emailVerify({ ...otpPayload }).unwrap();

      if (res?.data) {
        const { expiresAt } = res.data;

        setExpiredAt(new Date(expiresAt).getTime());

        toast.success("OTP sent to your email");

        setRegisterInfo(user);

        setShowOtpField(true);
      }
    } catch (error) {
      const message =
        (error as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "Failed to send OTP. Check backend .env email credentials.";

      toast.error(message);

      console.log("error: ", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleOtpValidation = async () => {
    const enteredOtp = otp?.trim();

    if (!enteredOtp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!registerInfo) {
      toast.error("Something went wrong. Please restart the process.");
      return;
    }

    if (Date.now() > expiredAt) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }

    setIsBusy(true);

    try {
      const otpResponse = await verifyOtp({
        email: registerInfo.email,
        otp: enteredOtp,
      }).unwrap();

      if (otpResponse?.data?.verificationToken) {
        const res = await registerUser({
          ...registerInfo,
          verificationToken: otpResponse.data.verificationToken,
        }).unwrap();

        if (res.data.accessToken) {
          toast.success("OTP validated successfully!");

          storeUserInfo({
            accessToken: res.data.accessToken,
          });

          navigate("/");
        }
      } else {
        throw new Error("No verification token received");
      }
    } catch (err: unknown) {
      const message =
        (err as { data?: Array<{ message?: string }> })?.data?.[0]?.message ||
        "OTP verification failed. Please check the code and try again.";

      toast.error(message);

      console.log("error: ", err);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Create Account"
        subtitle="Join StorySparkAI and begin your creative journey."
      >
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#121826]/80 backdrop-blur-xl border border-gray-800 shadow-2xl rounded-3xl p-8 md:p-10 transition-all duration-300">
            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/70"></div>
              </div>

              <div className="relative flex justify-center">
                <span className="px-4 bg-[#121826] text-xs tracking-[0.25em] uppercase text-indigo-300 font-semibold">
                  Sign Up With Email
                </span>
              </div>
            </div>

            {!showOtpField ? (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <SSInput
                  label="Name"
                  name="name"
                  placeholder="Enter your name"
                  required={true}
                  icon="fas fa-user"
                  register={register}
                  validation={{
                    required: "Name is required",
                    minLength: {
                      value: 8,
                      message: "Name must be at least 8 characters",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9._]+$/,
                      message:
                        "Only letters, numbers, underscores, and dots are allowed",
                    },
                  }}
                  error={errors.name}
                />

                <SSInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required={true}
                  icon="fas fa-envelope"
                  register={register}
                  error={errors.email}
                />

                <div className="space-y-2">
                  <SSInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Create a strong password"
                    required={true}
                    icon="fas fa-lock"
                    register={register}
                    error={errors.password}
                  />

                  <div
                    className={`text-xs rounded-xl px-4 py-3 border transition-all duration-300 ${
                      password
                        ? passwordError
                          ? "bg-red-500/10 border-red-500/30 text-red-300"
                          : "bg-green-500/10 border-green-500/30 text-green-300"
                        : "bg-gray-800/60 border-gray-700 text-gray-400"
                    }`}
                  >
                    {password
                      ? passwordError || "Strong password ✓"
                      : "Use 8+ characters with uppercase, lowercase, number & special character."}
                  </div>
                </div>

                <SSInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  required={true}
                  icon="fas fa-eye"
                  register={register}
                  error={errors.confirmPassword}
                />

                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-400 -mt-2">
                    Passwords do not match
                  </p>
                )}

                <div className="pt-2">
                  <SSButton
                    text="Create Account"
                    type="submit"
                    isLoading={isBusy}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <i className="fas fa-shield-alt text-indigo-400 text-xl"></i>
                  </div>

                  <h3 className="text-xl font-semibold text-white">
                    Verify Your Email
                  </h3>

                  <p className="text-sm text-gray-400">
                    Enter the OTP sent to your email address.
                  </p>
                </div>

                <SSInput
                  label="OTP Code"
                  name="otp"
                  placeholder="Enter your OTP"
                  required={true}
                  icon="fas fa-key"
                  register={register}
                />

                <SSButton
                  text="Verify OTP"
                  type="button"
                  onClick={handleOtpValidation}
                  isLoading={isBusy}
                />
              </div>
            )}

            {!showOtpField && (
              <div className="mt-8 text-center">
                <a
                  href="/login"
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors duration-200 hover:underline"
                >
                  Already have an account? Sign In
                </a>
              </div>
            )}
          </div>
        </div>
      </AuthLayout>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #374151",
          },
        }}
      />
    </>
  );
};

export default SignUpComponent;
