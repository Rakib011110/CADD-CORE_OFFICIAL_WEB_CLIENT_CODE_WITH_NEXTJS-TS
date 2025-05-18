"use client";
import { Player } from "@lottiefiles/react-lottie-player";

export default function AnimationPlayer() {
  return (
    <Player
      autoplay
      loop
      className="w-[80%] h-auto max-w-[400px]"
      src="https://assets6.lottiefiles.com/packages/lf20_nc1bp7st.json"
    />
  );
}
