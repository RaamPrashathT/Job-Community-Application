import { LoginForm } from "@/features/auth/components/LoginForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 bg-[#0A0A0A] flex items-center justify-center p-8">
        <LoginForm />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-[#050505]">
        <Image
          src="https://res.cloudinary.com/datgb606y/image/upload/q_auto/f_auto/v1775664377/Gemini_Generated_Image_6oc10f6oc10f6oc1_1_os8auv.png"
          alt="NightShift"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/60" />
      </div>
    </div>
  );
}
