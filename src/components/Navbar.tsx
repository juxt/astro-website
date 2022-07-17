import { createSignal } from "solid-js";
import logo from "../assets/images/logo.svg";
// fix meeee
// import { Image } from "@astrojs/image";

export default function Counter() {
  const [_count, _setCount] = createSignal<number>(0);

  return (
    <>
      <nav class="w-full bg-black h-14">
        <div class="container mx-auto px-2 2xl:px-0 max-w-6xl flex items-center justify-between h-full">
          <div class="flex items-center">
            <img src={logo} width="80px" />
          </div>
          <div class="flex items-center uppercase tracking-wider text-sm text-white">
            <a href="" class="px-4">
              About
            </a>
            <a href="" class="px-4">
              Blog
            </a>
          </div>
        </div>
      </nav>
      <div class="text-yellow-300"></div>
      <div class="counter-message"></div>
    </>
  );
}
