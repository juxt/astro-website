import { createSignal } from "solid-js";
import logo from "../assets/images/logo.svg";
// fix meeee
// import { Image } from "@astrojs/image";

export default function Counter() {
  const [_count, _setCount] = createSignal<number>(0);

  return (
    <>
      <nav class="w-full bg-red-500 h-14">
        <div class="container mx-auto flex items-center justify-between h-full">
          <div class="flex items-center">
            <img src={logo} width="100px" />
          </div>
          <div class="flex items-center">
            <button class="bg-white text-red-500 font-bold py-2 px-4 rounded-full">
              Sign in
            </button>
            <button class="bg-white text-red-500 font-bold py-2 px-4 rounded-full ml-4">
              Sign up
            </button>
          </div>
        </div>
      </nav>
      <div class="text-yellow-300"></div>
      <div class="counter-message"></div>
    </>
  );
}
