import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/hero/Hero";
import { WhoAmI } from "@/components/sections/WhoAmI";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      {/* Fixed nav — hidden over the title card, resolves in with the page */}
      <Nav />

      {/* Cinematic title card → scroll-driven resolve */}
      <Hero />

      {/* Resolved, well-lit portfolio */}
      <main>
        <WhoAmI />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
