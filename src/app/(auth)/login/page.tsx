import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-black">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-black relative flex items-center justify-center p-8 overflow-hidden">
        {/* Glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3ECF8E]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="z-10 w-full max-w-sm">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <Image
          src="https://res.cloudinary.com/datgb606y/image/upload/q_auto/f_auto/v1775664377/Gemini_Generated_Image_6oc10f6oc10f6oc1_1_os8auv.png"
          alt="NightShift"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
      </div>
    </div>
  );
}
