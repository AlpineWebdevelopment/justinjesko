import JesyNav from "@/components/JesyNav";
import Hero from "@/components/Hero";
import TheStory from "@/components/TheStory";
import Previews from "@/components/Previews";
import DJSets from "@/components/DJSets";
import Events from "@/components/Events";
import EmailSignup from "@/components/EmailSignup";
import Contact from "@/components/Contact";
import SocialFooter from "@/components/SocialFooter";
import SectionTransition from "@/components/SectionTransition";

export default function Jesko() {
  // https://coolors.co/c3ff00-ffffff-777777-3a3a3a-000000
  return (
    <>
      <JesyNav />
      <main className="relative overflow-x-hidden">
        {/* ─── DARK: Hero ─── */}
        <Hero showScrollIndicator={true} />

        {/* ─── DARK: The Story ─── */}
        <TheStory />
        {/* ─── WHITE: Previews / IDs ─── */}
        <SectionTransition fromColor="#000">
          <Previews />
        </SectionTransition>
        {/* ─── DARK: Events & Goals ─── */}
        <SectionTransition fromColor="#fff">
          <Events />
        </SectionTransition>

        {/* ─── WHITE: DJ Sets ─── */}
        <SectionTransition fromColor="#000">
          <DJSets />
        </SectionTransition>
        {/* ─── DARK: Email Signup ─── */}
        <EmailSignup />
        {/* ─── WHITE: Contact ─── */}
        <SectionTransition fromColor="#000">
          <Contact />
        </SectionTransition>
        {/* ─── DARK: Social + Footer ─── */}
        <SocialFooter />
      </main>
    </>
  );
}
